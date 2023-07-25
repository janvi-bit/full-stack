const PersonForm = ({submit, nameChange, numberChange}) => {
    return (

        <form onSubmit={submit}>
            <div>name: <input onChange={nameChange}/></div>
            <div>number: <input onChange={numberChange}/></div>
            <div><button type="submit">add</button></div>
        </form>
    )
}

export default PersonForm