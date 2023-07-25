const Persons = ({persons, handleDelete}) => {
    console.log(persons)
    return (
        persons.map(person => 
            <Person key={person.id} person={person} handleDelete={handleDelete} />
        )
    )
}

const Person = ({person, handleDelete}) => {
    return (
        <p>{person.name} {person.number} <button onClick={handleDelete}>delete</button></p>
    )
}

export default Persons

