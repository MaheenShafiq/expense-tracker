import React, { useReducer, useState } from 'react'

const initialState = { name: '', amount: '', category: '', date: '' }
const initialExpense = [];

export default function App() {
  const [form, dispatchForm] = useReducer(reducerForm, initialState);
  const [expense, dispatchExpense] = useReducer(reducerExpense, initialExpense)
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredList = activeCategory === 'all'
    ? expense
    : expense.filter(item => item.category === activeCategory)

  function handleChange(field, value) {
    dispatchForm({ type: 'CHANGE', field, value })
  }

  function handleReset() {
    dispatchForm({ type: 'RESET' })
  }

  function addExpense() {
    if (!form.name.trim() || !form.amount.trim()) return;
    dispatchExpense({
      type: 'ADD',
      id: Date.now(),
      name: form.name,
      amount: form.amount,
      category: form.category
    })
    dispatchForm({ type: 'RESET' })
  }

  function handleDelete(id) {
    dispatchExpense({ type: 'DELETE', id })
  }

  const total = expense.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const categories = ['All', 'Food', 'Transport', 'Education'];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Expense Tracker</h1>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col gap-3">
            <input
              value={form.name}
              type="text"
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Expense name"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            />
            <input
              value={form.amount}
              type="number"
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="Amount (Rs)"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            />
            <input
              value={form.category}
              type="text"
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="Category"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            />
            <input
              value={form.date}
              type="date"
              onChange={(e) => handleChange('date', e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            />
            <div className="flex gap-2 mt-1">
              <button
                onClick={addExpense}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                Add Expense
              </button>
              <button
                onClick={handleReset}
                className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-blue-500 rounded-2xl p-5 mb-6 text-white">
          <p className="text-sm opacity-80">Total Spent</p>
          <p className="text-3xl font-bold mt-1">Rs {total.toLocaleString()}</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category.toLowerCase())}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                ${activeCategory === category.toLowerCase()
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-300'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Expense List */}
        <div className="flex flex-col gap-3">
          {filteredList.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No expenses yet</p>
          )}
          {filteredList.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.category} {item.date && `· ${item.date}`}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-blue-500">Rs {Number(item.amount).toLocaleString()}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export function reducerForm(state, action) {
  switch (action.type) {
    case 'CHANGE': return { ...state, [action.field]: action.value }
    case 'RESET': return initialState
    default: return state
  }
}

export function reducerExpense(state, action) {
  switch (action.type) {
    case 'ADD': return [...state, action]
    case 'DELETE': return state.filter(item => item.id !== action.id)
    default: return state
  }
}