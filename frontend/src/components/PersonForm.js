const PersonForm = ({submit, nameChange, numberChange, nameValue, numberValue}) => {
    return (

        <form onSubmit={submit}>
            <div>name: <input onChange={nameChange} value={nameValue}/></div>
            <div>number: <input onChange={numberChange} value={numberValue}/></div>
            <div><button type="submit">add</button></div>
        </form>
    )
}

export default PersonForm