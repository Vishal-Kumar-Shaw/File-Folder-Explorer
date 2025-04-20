import "./styles.css";
import data from "./data.json";
import { useState } from "react";

const List = ({ data, handleAddFolder, handleDeleteFolder, handleAddFile }) => {
  const [isExpanded, setIsExpanded] = useState({});
  return (
    <div className="list-container">
      {data.map((d) => {
        return (
          <div className="list-element" key={d.id}>
            {d.isFolder && (
              <span
                className="btn"
                onClick={() =>
                  setIsExpanded((prev) => ({
                    ...prev,
                    [d.name]: !prev[d.name],
                  }))
                }
              >
                {isExpanded[d.name] ? "-" : "+"}
              </span>
            )}
            <span>{d.name}</span>
            {d.isFolder && (
              <span className="folder-ops" onClick={() => handleAddFile(d.id)}>
                <img
                  src="https://www.iconpacks.net/icons/2/free-file-icon-1453-thumb.png"
                  alt="add file"
                />
              </span>
            )}
            {d.isFolder && (
              <span
                className="folder-ops"
                onClick={() => handleAddFolder(d.id)}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3979/3979527.png"
                  alt="add folder"
                />
              </span>
            )}
            <span
              className="folder-ops"
              onClick={() => handleDeleteFolder(d.id)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3161/3161358.png"
                alt="Delete folder"
                onClick={() => handleDeleteFolder(d.id)}
              />
            </span>
            {isExpanded?.[d.name] && d.children && (
              <List
                data={d.children}
                handleAddFolder={handleAddFolder}
                handleDeleteFolder={handleDeleteFolder}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [tree, setTree] = useState(data);

  const handleAddFolder = (parentId) => {
    const name = prompt("Enter Name");
    const updateData = (prev) => {
      return prev.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [
              ...node.children,
              {
                id: (Date.now() + Math.floor(Math.random() * 10)) % 1000,
                name: name,
                isFolder: true,
                children: [],
              },
            ],
          };
        } else if (node.children) {
          return { ...node, children: updateData(node.children) };
        } else return node;
      });
    };

    setTree((prev) => updateData(prev));
  };

  const handleDeleteFolder = (id) => {
    const deleteFolder = (nodes) => {
      return nodes
        .filter((node) => node.id !== id)
        .map((node) => ({
          ...node,
          children: node.children ? deleteFolder(node.children) : [],
        }));
    };

    setTree((prev) => deleteFolder(prev));
  };
  const handleAddFile = (parentId) => {
    const name = prompt("Enter Name");

    const updateData = (prev) => {
      return prev.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [
              ...node.children,
              {
                id: (Date.now() + Math.floor(Math.random() * 10)) % 1000,
                name: name,
                isFolder: false,
              },
            ],
          };
        } else if (node.children) {
          return { ...node, children: updateData(node.children) };
        } else return node;
      });
    };

    setTree((prev) => updateData(prev));
  };

  return (
    <div className="App">
      <h1>File Explorer</h1>
      <List
        data={tree}
        handleAddFolder={handleAddFolder}
        handleDeleteFolder={handleDeleteFolder}
        handleAddFile={handleAddFile}
      />
    </div>
  );
}
