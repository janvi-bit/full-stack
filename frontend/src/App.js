import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState(false)
  const [search, setSearch] = useState('')
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialData => {
        setPersons(initialData)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const updatePerson = (existingPerson) => {
    if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
      const updatedPerson = {...existingPerson, number:newNumber}
      personService
        .update(existingPerson.id, updatedPerson)
        .then(modified => {
          setPersons(persons.map(p => p.id !== modified.id ? p : modified))
          setSuccess(`Modified ${modified.name} number`)
          setTimeout(() => {
            setSuccess(null)
          }, 4000)
        })
        .catch(error => {
          setPersons(persons.map(p => p.id !== existingPerson.id))
          setError(`Information of ${newName} has already been removed from the server`)
          setTimeout(() => {
            setSuccess(null)
          }, 4000)
        })
    }
  }


  const addNewPerson = (e) => {
    e.preventDefault()

    const existingPerson = persons.find(elem => elem.name === newName)

    if (existingPerson) {
      updatePerson(existingPerson)
    } else {
      const nameObj = {name: newName, number: newNumber }
      
      personService
        .create(nameObj)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setSuccess(`Added ${newPerson.name}`)
          setTimeout(() => {
            setSuccess(null)
          }, 4000)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (name, id) => {
    console.log(id)
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(res => {
          setPersons(persons.filter(p => p.id !== id))
          setSuccess(`Deleted ${name} successfully`)
        }
          
        )
    }

  }

  const handleFilter = (e) => {
    setFilter(true)
    setSearch(e.target.value)
  }

  const personsToShow = filter
  ? persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))
  : persons

  console.log(personsToShow)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {success} type="success"/>
      <Notification message = {error} type="error"/>
      <Filter onchange={handleFilter}/>
      <h2>add a new</h2>
      <PersonForm submit={addNewPerson} nameChange={handleNameChange} nameValue = {newName} numberValue = {newNumber} numberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      {personsToShow.map(person => 
        <p key={person.id}>{person.name} {person.number} <button onClick={() => deletePerson(person.name, person.id)}>delete</button>
        </p>
        )}
      {/* <Persons persons = {personsToShow} handleDelete={deletePerson}/> */}
    </div>
  )
}

export default App


// Example solution 

// import { useState, useEffect } from 'react'

// import Persons from './components/Persons'
// import PersonForm from './components/PersonForm'
// import Filter from './components/Filter'
// import Notification from './components/Notification'

// import personService from './services/persons'

// const App = () => {
//   const [persons, setPersons] = useState([]) 
//   const [newName, setNewName] = useState('')
//   const [newNumber, setNewNumber] = useState('')
//   const [filter, setFilter] = useState('')
//   const [info, setInfo] = useState({ message: null})

//   useEffect(() => {
//     personService.getAll().then((initialPersons => 
//       setPersons(initialPersons)
//     ))
//   }, [])

//   const notifyWith = (message, type='info') => {
//     setInfo({
//       message, type
//     })

//     setTimeout(() => {
//       setInfo({ message: null} )
//     }, 3000)
//   }

//   const cleanForm = () => {
//     setNewName('')
//     setNewNumber('') 
//   }

//   const updatePerson = (person) => {
//     const ok = window.confirm(`${newName} is already added to phonebook, replace the number?`)
//     if (ok) {
      
//       personService.update(person.id, {...person, number: newNumber}).then((updatedPerson) => {
//         setPersons(persons.map(p => p.id !== person.id ? p :updatedPerson ))
//         notifyWith(`phon number of ${person.name} updated!`)
//       })
//       .catch(() => {
//         notifyWith(`${person.name} has already been removed`, 'error')
//         setPersons(persons.filter(p => p.id !== person.id))
//       })

//       cleanForm()
//     }
//   }

//   const addPerson = (event) => {
//     event.preventDefault()
//     const person = persons.find(p => p.name === newName)

//     if (person) {
//       updatePerson(person)
//       return
//     }

//     personService.create({
//       name: newName,
//       number: newNumber
//     }).then(createdPerson => {
//       setPersons(persons.concat(createdPerson))

//       notifyWith(`${createdPerson.name} added!`)

//       cleanForm()
//     })
//   }

//   const removePerson = (person) => {
//     const ok = window.confirm(`remove ${person.name} from phonebook?`)
//     if ( ok ) {
//       personService.remove(person.id).then( () => {
//         setPersons(persons.filter(p => p.id !== person.id))
//         notifyWith(`number of ${person.name} deleted!`)
//       })
//     }
//   }

//   const byFilterField =
//     p => p.name.toLowerCase().includes(filter.toLowerCase())

//   const personsToShow = filter ? persons.filter(byFilterField) : persons

//   return (
//     <div>
//       <h2>Phonebook</h2>

//       <Notification info={info} />

//       <Filter filter={filter} setFilter={setFilter} />
      
//       <h3>Add a new</h3>

//       <PersonForm 
//         addPerson={addPerson}
//         newName={newName}
//         newNumber={newNumber}
//         setNewName={setNewName}
//         setNewNumber={setNewNumber}
//       />

//       <h3>Phone numbers</h3>

//       <Persons
//         persons={personsToShow}
//         removePerson={removePerson}
//       />
//     </div>
//   )

// }

// export default App