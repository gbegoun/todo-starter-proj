import { TodoPreview } from "./TodoPreview.jsx"
const { Link } = ReactRouterDOM

export function TodoList({ todos, onRemoveTodo, onToggleTodo, onColorPickerChange }) {
    const handleColorSelect = (event) => {
        onColorPickerChange(event.target.value, todo);
    
};
    return (
        <ul className="todo-list">
            {todos.map(todo =>
                <li key={todo._id} style={{ backgroundColor: todo.color }}>
                    <input className="color-picker"
                        type="color"
                        id="colorPicker"
                        name="colorPicker"
                        value={todo.color || '#ffffff'}
                        onChange={handleColorSelect}
                    />
                    <TodoPreview todo={todo} onToggleTodo={() => onToggleTodo(todo)} />
                    <section>
                        <button onClick={() => onRemoveTodo(todo._id)}>Remove</button>
                        <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
                        <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
                    </section>
                </li>
            )}
        </ul>
    )
}