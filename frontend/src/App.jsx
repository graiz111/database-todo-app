import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

function App() {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  
  useEffect(() => {
    fetch('http://localhost:3000/tasks')
      .then((response) => response.json())
      .then((data) => {
        setTasks(data.task); 
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  
  const changeHandler = (e) => {
    setTaskInput(e.target.value);
  };

  
  const onSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      // Edit task if editId is set
      fetch(`http://localhost:3000/tasks/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskInput }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTasks(data.task); 
          setEditId(null); 
          setTaskInput(""); 
        })
        .catch((error) => console.error('Error updating task:', error));
    } else {
     
      fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskInput }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTasks(data.task); 
          setTaskInput(""); 
        })
        .catch((error) => console.error('Error adding task:', error));
    }
  };

  
  const taskDelete = (id) => {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(data.task); 
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  
  const editTask = (id, taskText) => {
    setEditId(id); 
    setTaskInput(taskText); 
  };

  return (
    <div className="bg-green-300 p-4">
      <h1 className="text-3xl font-bold font-serif">TODO</h1>
      <div className="bg-slate-400 p-2 rounded-lg flex">
        <form onSubmit={onSubmit}>
          <input
            className="p-1 rounded-lg"
            type="text"
            value={taskInput}
            onChange={changeHandler}
            placeholder="Enter a task"
          />
          <button
            type="submit"
            className="bg-black rounded-lg text-white text-sm p-2 ml-10"
          >
            {editId ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>
      <div className="p-3">
        <ul className="pb-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="p-2 mb-2 bg-slate-200 w-80 flex justify-between gap-1"
            >
              {task.task}
              <div className="flex">
                <MdDelete
                  className="text-2xl m-1"
                  onClick={() => taskDelete(task._id)}
                />
                <FiEdit
                  className="text-xl m-1"
                  onClick={() => editTask(task._id, task.task)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
