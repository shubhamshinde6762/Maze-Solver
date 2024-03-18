import React, { useEffect, useState } from "react";
import { FaPlay, FaFlag } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const Grid = () => {
  const [grid, configureGrid] = useState({
    row: 0,
    column: 0,
  });

  const [gridTemp, configureGridTemp] = useState({
    row: 0,
    column: 0,
  });

  const [map, setMap] = useState([]);
  const [minPath, setMinPath] = useState([]);

  useEffect(() => {
    try {
      console.log(grid);
      if (
        gridTemp &&
        gridTemp.row &&
        gridTemp.column &&
        !isNaN(gridTemp.row) &&
        !isNaN(gridTemp.column) &&
        gridTemp.row > 0 &&
        gridTemp.column > 0
      ) {
        setMap(() => {
          const newMap = [];
          const numRows = parseInt(gridTemp.row, 10);
          const numColumns = parseInt(gridTemp.column, 10);
          if (numRows > 0 && numColumns > 0) {
            for (let i = 0; i < numRows; i++) {
              newMap.push(new Array(numColumns).fill(0));
            }
            newMap[0][0] = -1;
            newMap[numRows - 1][numColumns - 1] = -2;
          }
          return newMap;
        });
      } else {
        console.error("Invalid grid dimensions.");
      }

      configureGrid(gridTemp);
    } catch (err) {
      console.error("Error configuring grid:", err);
    }
  }, [grid, gridTemp]);

  const changeHandler = (event) => {
    const { id, value } = event.target;
    configureGridTemp((prevGrid) => ({
      ...prevGrid,
      [id]: parseInt(value, 10), // Parse the value to ensure it's a number
    }));
  };

  const gridHandler = (i, j) => {
    try {
      if ((i === 0 && j === 0) || (i === grid.row - 1 && j === grid.column - 1))
        return;
      const updatedMap = [...map];
      updatedMap[i][j] = updatedMap[i][j] === 0 ? 1 : 0;
      setMap(updatedMap);
    } catch (err) {
      console.error("Error updating grid:", err);
    }
  };

  const resetGrid = () => {
    setMap([]);
    setMinPath([]);
    configureGrid({
      row: 0,
      column: 0,
    });
  };

  const generateGrid = () => {
    if (!map || map.length === 0) {
      return (
        <div className="w-full text-center">
          Choose correct Rows and Column Input...
        </div>
      );
    }
    const rows = [];
    for (let i = 0; i < grid.row; i++) {
      const columns = [];
      for (let j = 0; j < grid.column; j++) {
        let content = null;
        let iconSize = 20;
        if (map[i][j] === -1) {
          content = <FaPlay className=" scale-125" size={iconSize} />;
        } else if (map[i][j] === -2) {
          content = <FaFlag className=" scale-125" size={iconSize} />;
        }
        let classNames =
          "w-full max-w-20 flex justify-center items-center text-center aspect-square border border-slate-600 bg-gray-200";
        if (minPath.some(([x, y]) => x === i && y === j)) {
          classNames += " bg-green-500";
        } else if (map[i][j] === 1) {
          classNames += " bg-red-500";
        }
        classNames += "";
        columns.push(
          <div
            key={`${i}-${j}`}
            onClick={() => gridHandler(i, j)}
            className={classNames}
          >
            {content}
          </div>
        );
      }
      rows.push(
        <div key={i} className="flex justify-center">
          {columns}
        </div>
      );
    }
    return rows.length ? rows : <div></div>;
  };

  const findPath = () => {
    const matrix = [...map];
    const size = grid.row;
    const dx = [1, 0, 0, -1];
    const dy = [0, 1, -1, 0];
    const ans = [];

    const isValid = (x, y) => {
      return (
        x >= 0 && x < size && y >= 0 && y < grid.column && matrix[x][y] !== 1
      );
    };

    const bfs = () => {
      const q = [];
      const visited = Array.from(Array(size), () => Array(size).fill(false));
      const parent = Array.from(Array(size), () => Array(size).fill([-1, -1]));

      q.push([0, 0]);
      visited[0][0] = true;

      while (q.length > 0) {
        const [x, y] = q.shift();

        if (x === grid.row - 1 && y === grid.column - 1) break;

        for (let i = 0; i < 4; i++) {
          const nx = x + dx[i];
          const ny = y + dy[i];

          if (isValid(nx, ny) && !visited[nx][ny]) {
            q.push([nx, ny]);
            visited[nx][ny] = true;
            parent[nx][ny] = [x, y];
          }
        }
      }

      if (!visited[grid.row - 1][grid.column - 1]) return false;

      let x = grid.row - 1;
      let y = grid.column - 1;

      while (x !== -1 && y !== -1) {
        ans.push([x, y]);
        const [px, py] = parent[x][y];
        x = px;
        y = py;
      }

      ans.reverse();
      return true;
    };

    if (!bfs()) {
      console.error("No path exists!");
      toast("No path exists!", {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    console.log(ans);

    setMinPath(ans);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div>
        <Toaster />
      </div>
      <div className="text-4xl font-bold text-center mt-5">Maze Solver</div>
      <div className="w-[90%] h-[2px] bg-slate-600 my-5 "></div>
      <div className="flex w-full gap-x-5 gap-y-5 mt-5 flex-wrap justify-center items-center ">
        <div className="flex gap-x-2">
          <label className="flex justify-center items-center flex-wrap shadow p-2 rounded-lg">
            <span className="mx-2 text-xl font-bold">Row</span>
            <input
              type="number"
              className=" bg-gray-200 w-28 px-2 text-xl text-center font-bold rounded-md"
              onChange={changeHandler}
              id="row"
              value={gridTemp.row}
            />
          </label>
          <label className="flex justify-center items-center flex-wrap shadow p-2 rounded-lg">
            <span className="mx-2 text-xl font-bold">Column</span>
            <input
              type="number"
              className=" bg-gray-200 w-28 px-2 text-xl text-center font-bold rounded-md"
              onChange={changeHandler}
              id="column"
              value={gridTemp.column}
            />
          </label>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={findPath}
        >
          Find Path
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={resetGrid}
        >
          Reset
        </button>
      </div>

      <div className="w-full mt-10 px-10">{generateGrid()}</div>
      <div className="w-[90%] h-[2px] bg-slate-600 my-5 mt-10 "></div>

      <div className="flex flex-col font-bold px-2 items-center">
        <div className="mt-2">
          Data Structure & Algorithm Laboratory Project
        </div>
        <div className="mt-2 text-center">Project By: Shubham Shinde</div>
      </div>
    </div>
  );
};

export default Grid;
