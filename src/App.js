import { useState, useEffect } from 'react';
import { Line } from 'rc-progress'; // Correct import for progress bar
import './App.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newTask = {
        text: newTodo,
        completed: false,
        dateAdded: new Date(),
        dueDate: null,
      };
      setTodos([...todos, newTask]);
      setNewTodo('');
    }
  };

  const toggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  const deleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    setSelectedIndex(null);
  };

  const moveUp = (index) => {
    if (index > 0) {
      const updatedTodos = [...todos];
      const temp = updatedTodos[index];
      updatedTodos[index] = updatedTodos[index - 1];
      updatedTodos[index - 1] = temp;
      setTodos(updatedTodos);
      setSelectedIndex(index - 1);
    }
  };

  const moveDown = (index) => {
    if (index < todos.length - 1) {
      const updatedTodos = [...todos];
      const temp = updatedTodos[index];
      updatedTodos[index] = updatedTodos[index + 1];
      updatedTodos[index + 1] = temp;
      setTodos(updatedTodos);
      setSelectedIndex(index + 1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
    if (e.key === 'Delete') {
      if (selectedIndex !== null) {
        deleteTodo(selectedIndex);
      } else {
        deleteTodo(todos.length - 1);
      }
    }
    if (e.key === 'ArrowUp' && selectedIndex !== null) {
      moveUp(selectedIndex);
    }
    if (e.key === 'ArrowDown' && selectedIndex !== null) {
      moveDown(selectedIndex);
    }
  };

  const pinToTop = (index) => {
    const pinnedTodo = todos[index];
    const updatedTodos = [pinnedTodo, ...todos.filter((_, i) => i !== index)];
    setTodos(updatedTodos);
  };

  const completionPercentage =
    (todos.filter(todo => todo.completed).length / todos.length) * 100 || 0;

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedIndex, todos]);

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter a new task"
      />
      <button onClick={addTodo}>Add</button>
      <Line percent={completionPercentage} strokeWidth="4" strokeColor="#4caf50" />
      <ul>
        {todos.map((todo, index) => (
          <li
            key={index}
            className={`todo-item ${selectedIndex === index ? 'selected' : ''} ${todo.completed ? 'completed' : ''
              }`}
            onClick={() => setSelectedIndex(index)}
            onDoubleClick={() => pinToTop(index)}
            style={{
              outline:
                todo.dueDate &&
                  new Date(todo.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000
                  ? '2px solid orange'
                  : todo.dueDate && new Date(todo.dueDate).getTime() < new Date().getTime()
                    ? '2px solid red'
                    : '',
            }}
          >
            {todo.text} <small>{todo.dateAdded.toLocaleString()}</small>
            <button onClick={() => toggleComplete(index)}>
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => deleteTodo(index)}>Delete</button>
            <button onClick={() => moveUp(index)}>Up</button>
            <button onClick={() => moveDown(index)}>Down</button>
          </li>
        ))}
      </ul>
      <p>
        {`Completed: ${todos.filter((todo) => todo.completed).length} / ${todos.length}`}
      </p>
    </div>
  );
};

export default TodoApp;




