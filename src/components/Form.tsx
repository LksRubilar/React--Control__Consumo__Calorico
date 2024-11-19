import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'
import { categories } from "../data/categories"
import type { Activity } from "../types"
import { useActivity } from "../hooks/useActivity"

const initialState: Activity = {
  id: uuidv4(),
  category: 1,
  name: '',
  calories: 0
}

export default function Form() {

  const { state, dispatch } = useActivity()
  const [activity, setActivity] = useState<Activity>(initialState)

  useEffect(() => {
    if (state.activeId) {
      const selectedActivity = state.activities.filter(stateActivity => stateActivity.id === state.activeId)[0]
      setActivity(selectedActivity)
    }

  }, [state.activeId])

  const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => { //e = evento
    const isNumberField = ['category', 'calories'].includes(e.target.id)
    //traemos una copia de activity, luego segun la categoria, ingresamos un valor
    setActivity({
      ...activity,
      [e.target.id]: isNumberField ? +e.target.value : e.target.value
    })

  }

  const isValidActivity = () => {
    const { name, calories } = activity
    return name.trim() !== '' && calories > 0

  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    dispatch({
      type: 'save-activity', payload: {
        newActivity: activity
      }
    })

    setActivity({
      ...initialState,
      id: uuidv4()

    })
  }



  return (
    <form
      className="space-y-5 bg-white shadow p-10 rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-3">
        <label className="font-bold" htmlFor="category">Categoria:</label>
        <select name=""
          className="bg-white border border-slate-300 p-2 rounded-lg w-full"
          id="category"
          value={activity.category}
          onChange={handleChange}
        >
          {categories.map(category => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label className="font-bold" htmlFor="name">Actividad:</label>
        <input
          type="text"
          id="name"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="Ej: Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta"
          value={activity.name}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label className="font-bold" htmlFor="calories">Calorias:</label>
        <input
          type="number"
          id="calories"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="Calorias. ej: 300 o 500"
          value={activity.calories}
          onChange={handleChange}
        />
      </div>

      <input
        type="submit"
        className="uppercase text-white bg-gray-800 hover:bg-gray-900 w-full p-2 cursor-pointer disabled:opacity-20"
        value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
        disabled={!isValidActivity()}
      />

    </form>
  )
}
