const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux

import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { SET_FILTER_BY } from "../store/reducers/todo.reducer.js"
import { loadTodos, removeTodoOptimistic, updateTodo } from "../store/actions/todo.actions.js"
import { setBalance } from '../store/actions/user.actions.js'

export function TodoIndex() {

    const todos = useSelector(storeState => storeState.todoModule.todos)
    const filterBy = useSelector(storeState => storeState.todoModule.filterBy)
    const isLoading = useSelector(storeState => storeState.todoModule.isLoading)
    const user = useSelector(storeState => storeState.userModule.loggedInUser)
    const balance = user ? user.balance : null
    const dispatch = useDispatch()

    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()
    const defaultFilter = todoService.getFilterFromSearchParams(searchParams)


    useEffect(() => {
        loadTodos()
            .catch(err => showErrorMsg('Cannot load todos'))
    }, [filterBy])

    function onRemoveTodo(todoId) {
        removeTodoOptimistic(todoId)
            .then(() => showSuccessMsg('Todo removed successfully'))
            .catch(err => showErrorMsg('Cannot remove todo ' + todoId))
    }

    function onToggleTodo(todo) {
        const todoToUpdate = { ...todo, isDone: !todo.isDone }
        updateTodo(todoToUpdate)
            .then(() => {
                setBalance(user._id, user.balance + 5)

            })
            .catch(err => { console.log('err2:', err) })
    }

    function setFilterBy(filterBy) {
        dispatch({ type: SET_FILTER_BY, filterBy })
    }

    function onColorPickerChange(color, todo){
        const updatedTodo = { ...todo, color: color }
        updateTodo(updatedTodo)
        // todoService.save(updatedTodo)
    }

    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilterBy={setFilterBy} />
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            {!isLoading
                ? <React.Fragment>
                    <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} onColorPickerChange={onColorPickerChange} />
                    <hr />
                    <h2>Todos Table</h2>
                    <div style={{ width: '60%', margin: 'auto' }}>
                        <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
                    </div>
                </React.Fragment>
                : <div>Loading...</div>
            }
        </section>
    )
}