import React, { useState, useEffect } from 'react';
import { Button, FormControl, Input, InputLabel } from '@material-ui/core';
import './App.css';
import './Todo.css';
import Todo from './Todo';
import db from './firebase';
import firebase from "firebase";
import AddIcon from '@material-ui/icons/Add';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  // when app loads, we need to listen to db and fetch new todos as they get added
  useEffect(() => {
    // this code here... fires when app.js loads
    db.collection('todos').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setTodos(snapshot.docs.map(doc => ({id: doc.id, todo: doc.data().todo})))
    })
  }, []);

  const addTodo = (event) => {
    event.preventDefault();
    
    db.collection('todos').add({
      todo: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()   
    })

    setTodos([...todos, input]);
    setInput('');
  }

  return (
    <div className="App">
      <h1>To Do List App</h1>
      <form>
        <FormControl>
          <InputLabel><AddIcon/>Write a Task</InputLabel>
          <Input value={input} onChange={event => setInput(event.target.value)}/>
        </FormControl>
          <Button disabled={!input} variant="contained" color="primary" type="submit" onClick={addTodo}>
            Add Task
          </Button>

      </form>
      
      <ul class="todo-list">
        {todos.map(todo => (
          <Todo todo={todo}/>
        ))}
      </ul>

    </div>
  );
}

export default App;