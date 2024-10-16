import React, { useEffect, useState } from 'react'
import { TiPencil } from 'react-icons/ti'
import { BsTrash } from 'react-icons/bs'

import styles from '../styles/modules/todolist.module.scss'
const ToDoList = () => {
    let initialTodos = [{
        task: "Something",
        id: "1",
        completed: false
        
    }]

    const [todoList, setTodoList] = useState(() => {
        const savedTodos = localStorage.getItem('todoList');
        return savedTodos ? JSON.parse(savedTodos) : initialTodos;
    });
    const [sortCriteria, setSortCriteria] = useState('All')
    const [currentToDo, setCurrentToDo] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [newTask, setNewTask] = useState("")

    console.log(newTask)

    useEffect(() => {
        if (todoList?.length > 0) {
          localStorage.setItem("todoList", JSON.stringify(todoList));
        }
      }, [todoList]);


    const handleAddToDo = (task) => {
        if (task.trim()?.length === 0) {
            alert("please enter a todo");
        } else {
            setTodoList([...todoList, {task: task, id: Date.now(), completed: false}])
            setNewTask("")
        }
    }

    const handleUpdateToDoList = (id, task) => {
        if (task.trim()?.length === 0) {
            alert("please enter a todo");
        } else {

            const index = todoList.findIndex((todo)=> todo.id === id);
            todoList[index].task = task;
            setNewTask("")
            setCurrentToDo(null)
            setShowModal(false)
        }
    }
    
    const handleDeleteToDo = (id)=>{
        const updatedToDoList = todoList?.filter(todo=> todo.id !== id);
        setTodoList(updatedToDoList);
        localStorage.setItem('todoList', JSON.stringify(updatedToDoList))
    }

    const handleSort = (sortCriteria)=>{
        setSortCriteria(sortCriteria);
    }
    const sortToDoList = todoList?.filter( todo => {
         if(sortCriteria === "All") return true;
         if(sortCriteria === "Completed" && todo.completed) return true;
         if(sortCriteria === "Not Completed" && !todo.completed) return true;
         return false;
    })


    const handleToggleCompleted = (id)=>{
        const updatedTodoList = todoList.map(todo=> todo.id === id ? {...todo, completed:!todo.completed} : todo);

        setTodoList(updatedTodoList)
    }
    return (
        <div className={styles.todosContainer}>
            {
                showModal && (
                    <div className={styles.modal}>
                        <div className={styles.inputWrapper}>
                            <input type='text' placeholder={currentToDo ? "Update your todo" : "Enter your todo"} className={styles.inputTodo} value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                            <div className={styles.modalButtonsWrapper}>
                                {currentToDo ? (
                                    <>
                                        <button className={styles.addButton} onClick={()=>{setShowModal(false); handleUpdateToDoList(currentToDo.id, newTask)}}>Save</button>
                                        <button className={styles.cancelButton} onClick={()=> {setShowModal(false)}}>Cancel</button>
                                    </>) : (
                                    <>
                                        <button className={styles.cancelButton} onClick={() => setShowModal(false)}>Cancel</button>
                                        <button className={styles.addButton} onClick={() => { setShowModal(false); handleAddToDo(newTask) }}>Add</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
            <div className={styles.todosWrapper}>
                {todoList?.length === 0 ? 
                <>
                <div>
                        <div>
                            <h1 className={styles.emptyText}>EMPTY TODOS...</h1>
                            <p className={styles.emptySmallText}>You can add one.</p>
                        </div>
                </div>
                </> : 
                <div>
                    <div className={styles.selectWrapper}>
                        <select className={styles.sortSelect} onChange={(e)=>handleSort(e.target.value)}>
                            <option value="All">All</option>
                            <option value="Completed">Completed</option>
                            <option value="Not Completed">Not Completed</option>
                        </select>
                        <p className={styles.instruction}>for toggle complete click on the TODO text</p>
                    </div>
                    {sortToDoList?.map(todo=>(
                        <div key={todo.id} className={styles.mainTodo}>
                            <div className={styles.todoText} style={todo.completed ? {textDecoration:'line-through', color:'#22C55E'} : {color:"#FF4F5A"}} onClick={()=>{handleToggleCompleted(todo.id)}}>{todo.task}</div>
                            <div className={styles.todoButtonsWrapper}>
                                <button className={styles.editButton} onClick={()=> {setShowModal(true); setCurrentToDo(todo); setNewTask(todo.task)}}><TiPencil fontSize="medium"/></button>
                                <button className={styles.deleteButton} onClick={()=> handleDeleteToDo(todo.id)}><BsTrash fontSize="medium"/></button>
                            </div>
                        </div>
                    ))}
                </div>
                }
                
            </div>
            <button className={styles.addtodo_button} onClick={() => setShowModal(true)}>Add Todo</button>
        </div>
    )
}

export default ToDoList