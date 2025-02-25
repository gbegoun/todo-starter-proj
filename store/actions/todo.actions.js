import { todoService } from "../../services/todo.service.js"
import { store } from "../store.js"
import { 
    SET_TODOS,
    REMOVE_TODO,
    ADD_TODO,
    UPDATE_TODO,
    SET_FILTER_BY ,
    SET_IS_LOADING,
    UNDO_TODOS, } from "../reducers/todo.reducer.js"

export function loadTodos() {
    const filterBy = store.getState().todoModule.filterBy
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    return todoService.query(filterBy)
            .then(todos => store.dispatch({ type: SET_TODOS, todos }))
            .catch(err => console.log('Cannot load todos', err))
            .finally(() => store.dispatch({ type: SET_IS_LOADING, isLoading: false }))
}

export function updateTodo(todo){
    store.dispatch({ type: UPDATE_TODO, todo })
    return todoService.save(todo)
            .catch(err => {
                const unToggledTodo = { ...todo, isDone: !todo.isDone }
                store.dispatch({ type: UPDATE_TODO, unToggledTodo })
                console.log('Cannot update todo', err)
                throw err
            })
}

export function removeTodoOptimistic(todoId) {
    store.dispatch({ type: REMOVE_TODO, todoId })
    return todoService.remove(todoId)
            .catch(err => {
                store.dispatch({ type: UNDO_TODOS })
                console.log('Cannot remove todo', err)
                throw err
            })
}

export function removeTodo(todoId){
    todoService.remove(todoId)
    .then(() => store.dispatch({ type: REMOVE_TODO, todoId }))
    .catch(err => console.log('Cannot remove todo', err))
}