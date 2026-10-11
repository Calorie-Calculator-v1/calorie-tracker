import { useEffect, useState } from 'react'
import { api, localDate, number, weekDays } from './api.js'
import './App.css'

function Icon({ name, size = 20 }) {
    const paths = {
        leaf: (
            <>
                <path d="M12 3c0 4-5 6-5 11a5 5 0 0 0 10 0c0-5-5-7-5-11Z" />
                <path d="M12 17v7" />
            </>
        ),
        dashboard: (
            <>
                <rect x="3" y="3" width="7" height="8" rx="1" />
                <rect x="14" y="3" width="7" height="5" rx="1" />
                <rect x="3" y="15" width="7" height="6" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
            </>
        ),
        database: (
            <>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 9v12" />
            </>
        ),
        plus: <path d="M12 6v12M6 12h12" />,
        meal: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v8M8 12h8" />
            </>
        ),
        diary: (
            <>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
            </>
        ),
        reports: <path d="M3 3v18h18M7 15l4-6 4 3 5-8" />,
        profile: (
            <>
                <circle cx="12" cy="7" r="4" />
                <path d="M4 22v-2a8 8 0 0 1 16 0v2" />
            </>
        ),
        clock: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
            </>
        ),
        search: (
            <>
                <circle cx="10" cy="10" r="7" />
                <path d="m15 15 6 6" />
            </>
        ),
        close: <path d="m6 6 12 12M6 18 18 6" />,
        logout: <path d="M9 4H4v16h5M10 12h11m-5-5 5 5-5 5" />,
        trash: <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />,
    }
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[name] || paths.leaf}
        </svg>
    )
}

function Brand({ onClick }) {
    return (
        <button className="brand" onClick={onClick} aria-label="Gainly home">
            <Icon name="leaf" size={25} />
            <span>Gainly</span>
        </button>
    )
}

function Progress({ value, goal, orange = false }) {
    return (
        <div
            className={`progress ${orange ? 'orange' : ''}`}
            role="meter"
            aria-label="Progress toward goal"
            aria-valuenow={Math.round(value)}
            aria-valuemin={0}
            aria-valuemax={Math.max(goal, Math.round(value))}
        >
            <span style={{ width: `${Math.min(100, Math.max(0, (value / goal) * 100))}%` }} />
        </div>
    )
}

function Notice({ children, error = false }) {
    return children ? (
        <div className={`notice ${error ? 'error' : ''}`} role={error ? 'alert' : 'status'}>
            {children}
        </div>
    ) : null
}

function Landing({ onOpen }) {
    return (
        <div className="landing">
            <header className="landing-header">
                <Brand onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
                <button className="button" onClick={onOpen}>
                    Open dashboard
                </button>
            </header>
            <main>
                <section className="hero">
                    <div className="hero-copy">
                        <h1>
                            Know exactly what's on
                            <br className="desktop-break" /> your plate.
                        </h1>
                        <p>
                            Log meals from your food database, see your calories and macros update in real time, and spot the trends
                            a week of eating actually makes.
                        </p>
                        <div className="hero-actions">
                            <button className="button" onClick={onOpen}>
                                Open dashboard
                            </button>
                            <a className="button secondary" href="#how-it-works">
                                See how it works
                            </a>
                        </div>
                    </div>
                    <div className="card hero-card" aria-label="Example daily nutrition summary">
            <span className="eyebrow">
              Today <span className="example-label">Example</span>
            </span>
                        <div className="hero-total">
                            1,640 <span>/ 1,800 kcal</span>
                        </div>
                        <Progress value={1640} goal={1800} />
                        <div className="hero-macros">
                            <div>
                                <strong>82g</strong>
                                <span>Protein</span>
                            </div>
                            <div>
                                <strong>48g</strong>
                                <span>Fat</span>
                            </div>
                            <div>
                                <strong>190g</strong>
                                <span>Carbs</span>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="features" id="how-it-works">
                    <article>
                        <Icon name="clock" size={25} />
                        <h2>Log in seconds</h2>
                        <p>Search any food, pick a serving, and it's in your diary.</p>
                    </article>
                    <article>
                        <Icon name="reports" size={25} />
                        <h2>See your macros</h2>
                        <p>Protein, fat and carbs broken down automatically, every day.</p>
                    </article>
                    <article>
                        <Icon name="database" size={25} />
                        <h2>Browse the database</h2>
                        <p>Find the foods you eat and their calories per serving, in one place.</p>
                    </article>
                </section>
            </main>
            <footer className="landing-footer">
                <span>A little awareness. A healthier everyday.</span>
                <span>Made for your daily gains.</span>
            </footer>
        </div>
    )
}

function Auth({ onLogin, onHome, initialError }) {
    const [mode, setMode] = useState('login')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState(initialError || '')
    const [message, setMessage] = useState('')

    async function submit(event) {
        event.preventDefault()
        setBusy(true)
        setError('')
        setMessage('')
        const values = Object.fromEntries(new FormData(event.currentTarget))
        try {
            if (mode === 'register') {
                await api.register(values)
                setMessage('Account created. Check your email for the verification link, then sign in.')
                setMode('login')
            } else {
                await api.login(values)
                onLogin(await api.me())
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="auth-page">
            <Brand onClick={onHome} />
            <main className="card auth-card">
                <span className="eyebrow">Your everyday, a little healthier</span>
                <h1>{mode === 'login' ? 'Welcome to Gainly.' : 'Make room for better habits.'}</h1>
                <p>{mode === 'login' ? 'Sign in to pick up where you left off.' : 'Create an account to start your food diary.'}</p>
                <Notice error>{error}</Notice>
                <Notice>{message}</Notice>
                <form onSubmit={submit}>
                    {mode === 'register' && (
                        <label>
                            Your name
                            <input name="username" autoComplete="name" required maxLength={100} placeholder="Your name" />
                        </label>
                    )}
                    <label>
                        Email address
                        <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
                    </label>
                    <label>
                        Password
                        <input
                            name="password"
                            type="password"
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            minLength={mode === 'register' ? 6 : undefined}
                            required
                            placeholder={mode === 'register' ? 'At least 6 characters' : 'Your password'}
                        />
                    </label>
                    <button className="button full" disabled={busy}>
                        {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
                    </button>
                </form>
                <p className="auth-switch">
                    {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
                    <button
                        className="text-button"
                        disabled={busy}
                        onClick={() => {
                            setMode(mode === 'login' ? 'register' : 'login')
                            setError('')
                            setMessage('')
                        }}
                    >
                        {mode === 'login' ? 'Create an account' : 'Sign in'}
                    </button>
                </p>
            </main>
            <p className="auth-note">Small steps. Lasting habits.</p>
        </div>
    )
}

function MacroChart({ summary }) {
    const values = [
        Number(summary.totalProtein || 0) * 4,
        Number(summary.totalFat || 0) * 9,
        Number(summary.totalCarbs || 0) * 4,
    ]
    const total = values.reduce((a, b) => a + b, 0)
    const p = total ? (values[0] / total) * 100 : 0
    const f = total ? (values[1] / total) * 100 : 0
    const c = total ? Math.max(0, 100 - p - f) : 0

    return (
        <section className="card chart-card">
            <h2>Macro split</h2>
            <div className="macro-content">
                <div
                    className="donut"
                    role="img"
                    aria-label={total ? 'Macronutrient split by calories' : 'No macros logged yet'}
                    style={{
                        background: total
                            ? `conic-gradient(var(--orange) 0% ${p}%, var(--yellow) ${p}% ${p + f}%, var(--green) ${p + f}% 100%)`
                            : 'var(--track)',
                    }}
                />
                <div className="legend">
                    {[
                        ['Protein', summary.totalProtein, p, 'protein'],
                        ['Fat', summary.totalFat, f, 'fat'],
                        ['Carbs', summary.totalCarbs, c, 'carbs'],
                    ].map(([label, value, percent, key]) => (
                        <div key={key}>
                            <i className={key} />
                            <span>
                {label} · {number(value)}g <span className="muted">({Math.round(percent)}%)</span>
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function WeekChart({ history }) {
    const days = weekDays(history)
    const max = Math.max(...days.map((d) => Number(d.totalCalories)), 1)

    return (
        <section className="card chart-card">
            <h2>Last 7 days</h2>
            <div className="week-chart" aria-label="Daily calories for the last seven days">
                {days.map((day, i) => (
                    <div className="bar-column" key={day.date}>
                        <div className="bar-space">
                            <div
                                className={`bar ${i === 6 ? 'current' : ''}`}
                                style={{
                                    height: `${Math.max(day.totalCalories ? 5 : 0, (Number(day.totalCalories) / max) * 100)}%`,
                                }}
                                tabIndex={0}
                                aria-label={`${day.date}: ${number(day.totalCalories)} kcal`}
                            >
                                <span className="bar-tooltip">{number(day.totalCalories)} kcal</span>
                            </div>
                        </div>
                        <span>{new Date(`${day.date}T12:00:00`).toLocaleDateString('en', { weekday: 'narrow' })}</span>
                    </div>
                ))}
            </div>
            {!history.length && <span className="chart-empty">Your week starts with your first meal.</span>}
        </section>
    )
}

function Meals({ meals, onDelete, deleting, onAdd }) {
    if (!meals.length) {
        return (
            <div className="empty">
                <Icon name="meal" size={30} />
                <h3>A fresh page in your food diary.</h3>
                <p>Add a meal to see your nutrition here.</p>
                <button className="button secondary" onClick={onAdd}>
                    <Icon name="plus" size={16} />
                    Log a meal
                </button>
            </div>
        )
    }
    return (
        <div className="table-scroll">
            <table>
                <thead>
                <tr>
                    <th>Food</th>
                    <th>Meal</th>
                    <th>Serving</th>
                    <th>Calories</th>
                    {onDelete && (
                        <th>
                            <span className="sr-only">Actions</span>
                        </th>
                    )}
                </tr>
                </thead>
                <tbody>
                {meals.map((meal) => (
                    <tr key={meal.id}>
                        <td>{meal.foodName}</td>
                        <td>
                            <span className={`badge ${String(meal.mealType).toLowerCase()}`}>{meal.mealType || 'Meal'}</span>
                        </td>
                        <td>
                            {number(meal.quantity, 2)} {Number(meal.quantity) === 1 ? 'serving' : 'servings'}
                        </td>
                        <td>{number(meal.totalCalories)} kcal</td>
                        {onDelete && (
                            <td className="action-cell">
                                <button
                                    className="icon-button danger"
                                    onClick={() => onDelete(meal)}
                                    disabled={deleting === meal.id}
                                    aria-label={`Delete ${meal.foodName}`}
                                >
                                    <Icon name="trash" size={16} />
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

function FoodSearch({ onSelect }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!query.trim()) return
        const controller = new AbortController()
        const timer = setTimeout(async () => {
            try {
                setResults(await api.search(query.trim(), controller.signal))
            } catch (err) {
                if (err.name !== 'AbortError') setError(err.message)
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }, 300)
        return () => {
            clearTimeout(timer)
            controller.abort()
        }
    }, [query])

    return (
        <>
            <label className="search-input">
                <Icon name="search" />
                <input
                    type="search"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setResults([])
                        setError('')
                        setLoading(Boolean(e.target.value.trim()))
                    }}
                    placeholder="Search for a food, e.g. brown rice"
                    aria-label="Search food database"
                />
            </label>
            <Notice error>{error}</Notice>
            {!query.trim() ? (
                <div className="empty">
                    <Icon name="database" size={32} />
                    <h3>Good food starts with knowing.</h3>
                    <p>Search your food database to find calories per serving.</p>
                </div>
            ) : loading ? (
                <p className="loading" role="status">
                    Searching foods…
                </p>
            ) : (
                !error && (
                    <>
                        <p className="results-caption">
                            {results.length} {results.length === 1 ? 'food' : 'foods'} found · Nutrition per serving
                        </p>
                        <div className="food-results">
                            {results.map((food) => (
                                <button className="food-result" key={food.id} onClick={() => onSelect(food)}>
                  <span>
                    <strong>{food.name}</strong>
                    <small>{number(food.caloriesPerServing)} kcal / serving</small>
                  </span>
                                    <span className="add-food">
                    <Icon name="plus" size={18} />
                    <span>Add</span>
                  </span>
                                </button>
                            ))}
                        </div>
                        {!results.length && <p className="empty">No foods found. Try another name or a shorter search.</p>}
                    </>
                )
            )}
        </>
    )
}

function MealModal({ initialFood, onClose, onSaved }) {
    const [food, setFood] = useState(initialFood)
    const [quantity, setQuantity] = useState('1')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const prior = document.activeElement
        const dialog = document.getElementById('meal-dialog')
        dialog?.showModal()
        return () => {
            dialog?.close()
            prior?.focus()
        }
    }, [])

    async function save(event) {
        event.preventDefault()
        setBusy(true)
        setError('')
        try {
            const values = Object.fromEntries(new FormData(event.currentTarget))
            await api.addMeal({
                foodId: food.id,
                quantity: Number(quantity),
                mealType: values.mealType,
                loggedDate: values.loggedDate,
            })
            onSaved()
        } catch (err) {
            setError(err.message)
            setBusy(false)
        }
    }

    return (
        <dialog
            id="meal-dialog"
            className="meal-modal"
            onCancel={(event) => {
                event.preventDefault()
                if (!busy) onClose()
            }}
            aria-labelledby="meal-title"
        >
            <div className="section-heading">
                <div>
                    <span className="eyebrow">One meal at a time</span>
                    <h2 id="meal-title">Log a meal</h2>
                </div>
                <button className="icon-button" onClick={onClose} disabled={busy} aria-label="Close dialog">
                    <Icon name="close" />
                </button>
            </div>
            <Notice error>{error}</Notice>
            {!food ? (
                <FoodSearch onSelect={setFood} />
            ) : (
                <form onSubmit={save}>
                    <div className="selected-food">
                        <div>
                            <strong>{food.name}</strong>
                            <p>{number(food.caloriesPerServing)} kcal per serving</p>
                        </div>
                        <button type="button" className="text-button" disabled={busy} onClick={() => setFood(null)}>
                            Change
                        </button>
                    </div>
                    <div className="form-grid">
                        <label>
                            Number of servings
                            <input
                                type="number"
                                min="0.01"
                                max="1000"
                                step="0.01"
                                required
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </label>
                        <label>
                            Meal
                            <select name="mealType" defaultValue="Lunch">
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Dinner</option>
                                <option>Snack</option>
                            </select>
                        </label>
                    </div>
                    <label>
                        Date
                        <input name="loggedDate" type="date" defaultValue={localDate()} max={localDate()} required />
                    </label>
                    <div className="meal-total">
                        <span>Total calories</span>
                        <strong>
                            {number(Number(food.caloriesPerServing) * Number(quantity))} <small>kcal</small>
                        </strong>
                    </div>
                    <button className="button full" disabled={busy}>
                        {busy ? 'Saving meal…' : 'Add to diary'}
                        <Icon name="plus" size={17} />
                    </button>
                </form>
            )}
        </dialog>
    )
}

const navigation = [
    ['dashboard', 'Dashboard'],
    ['database', 'Food database'],
    ['meal', 'Log a meal'],
    ['diary', 'Diary'],
    ['reports', 'Reports'],
    ['profile', 'Profile'],
]
const validPages = ['dashboard', 'database', 'diary', 'reports', 'profile']

function Workspace({ user, onLogout, onHome, onExpired }) {
    const [page, setPage] = useState(validPages.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'dashboard')
    const [summary, setSummary] = useState(null)
    const [history, setHistory] = useState([])
    const [date, setDate] = useState(localDate())
    const [diary, setDiary] = useState([])
    const [loading, setLoading] = useState(true)
    const [diaryLoading, setDiaryLoading] = useState(true)
    const [error, setError] = useState('')
    const [diaryError, setDiaryError] = useState('')
    const [message, setMessage] = useState('')
    const [modal, setModal] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(null)
    const [revision, setRevision] = useState(0)
    const [signingOut, setSigningOut] = useState(false)

    const storageKey = `gainly-goals:${user.email}`
    const [goals, setGoals] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey))
            return saved?.calories > 0 && saved?.protein > 0 ? saved : { calories: 1800, protein: 120 }
        } catch {
            return { calories: 1800, protein: 120 }
        }
    })

    useEffect(() => {
        const controller = new AbortController()
        Promise.all([api.summary(controller.signal), api.history(controller.signal)])
            .then(([s, h]) => {
                setSummary(s)
                setHistory(h)
                setError('')
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    if (err.status === 401) onExpired()
                    else setError(err.message)
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false)
            })
        return () => controller.abort()
    }, [revision, onExpired])

    useEffect(() => {
        const controller = new AbortController()
        api.meals(date, controller.signal)
            .then((data) => {
                setDiary(data)
                setDiaryError('')
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    if (err.status === 401) onExpired()
                    else setDiaryError(err.message)
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setDiaryLoading(false)
            })
        return () => controller.abort()
    }, [date, revision, onExpired])

    useEffect(() => {
        const change = () => {
            const next = location.hash.slice(1)
            if (validPages.includes(next)) setPage(next)
        }
        window.addEventListener('hashchange', change)
        return () => window.removeEventListener('hashchange', change)
    }, [])

    function navigate(next) {
        if (next === 'meal') setModal({})
        else {
            setPage(next)
            location.hash = next
            setMessage('')
        }
    }

    function reload() {
        setLoading(true)
        setDiaryLoading(true)
        setRevision((n) => n + 1)
    }

    async function remove() {
        setDeleting(deleteTarget.id)
        try {
            await api.deleteMeal(deleteTarget.id)
            setDeleteTarget(null)
            setMessage('Meal removed from your diary.')
            reload()
        } catch (err) {
            setError(err.message)
            setDeleteTarget(null)
        } finally {
            setDeleting(null)
        }
    }

    async function logout() {
        setSigningOut(true)
        try {
            await api.logout()
            onLogout()
        } catch (err) {
            setError(err.message)
        } finally {
            setSigningOut(false)
        }
    }

    const today = summary || { totalCalories: 0, totalProtein: 0, totalFat: 0, totalCarbs: 0, meals: [] }
    const recent = new Set(
        Array.from({ length: 14 }, (_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - i)
            return localDate(d)
        })
    )
    const logged = history.filter((d) => recent.has(d.date) && d.meals.length).length
    const title =
        page === 'dashboard'
            ? `Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, ${
                user.name.split(' ')[0]
            }`
            : navigation.find((n) => n[0] === page)?.[1]

    return (
        <div className="workspace">
            <aside className="sidebar">
                <Brand onClick={onHome} />
                <nav aria-label="Main navigation">
                    {navigation.map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => navigate(key)}
                            className={`nav-item ${page === key ? 'active' : ''}`}
                            aria-current={page === key ? 'page' : undefined}
                        >
                            <Icon name={key} />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>
                <div className="sidebar-bottom">
                    <div className="user-mini">
                        <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
                        <div>
                            <strong>{user.name}</strong>
                            <small>A little better, every day.</small>
                        </div>
                    </div>
                    <button className="nav-item" onClick={logout} disabled={signingOut}>
                        <Icon name="logout" />
                        <span>{signingOut ? 'Signing out…' : 'Sign out'}</span>
                    </button>
                </div>
            </aside>

            <main className="workspace-main">
                <header className="workspace-header">
                    <div>
                        <h1>{title}</h1>
                        <p>
                            {page === 'dashboard'
                                ? new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
                                : {
                                    database: 'Find your everyday foods. Know what goes into them.',
                                    diary: 'Every meal, all in one place.',
                                    reports: 'A little perspective on your everyday progress.',
                                    profile: 'Your account and your daily goals.',
                                }[page]}
                        </p>
                    </div>
                    <button className="button" onClick={() => setModal({})}>
                        <Icon name="plus" size={17} />
                        Log a meal
                    </button>
                </header>

                <Notice error>{error}</Notice>
                {error && (
                    <button className="text-button retry" onClick={reload}>
                        Retry loading data
                    </button>
                )}
                <Notice>{message}</Notice>

                {page === 'dashboard' &&
                    (loading ? (
                        <div className="card loading" role="status">
                            Loading your day…
                        </div>
                    ) : error && !summary ? (
                        <div className="card empty">
                            <h2>Your dashboard is unavailable.</h2>
                            <p>Retry when your backend is connected.</p>
                        </div>
                    ) : (
                        <>
                            <div className="stats-grid">
                                <section className="card stat">
                                    <span className="eyebrow">Calories today</span>
                                    <div className="stat-value">
                                        {number(today.totalCalories)} <span>/ {number(goals.calories)}</span>
                                    </div>
                                    <Progress value={today.totalCalories} goal={goals.calories} />
                                </section>
                                <section className="card stat">
                                    <span className="eyebrow">Protein today</span>
                                    <div className="stat-value">
                                        {number(today.totalProtein)}
                                        <span>g</span>
                                    </div>
                                    <Progress value={today.totalProtein} goal={goals.protein} orange />
                                </section>
                                <section className="card stat">
                                    <span className="eyebrow">Days logged</span>
                                    <div className="stat-value">
                                        {logged} <span>/ 14</span>
                                    </div>
                                    <Progress value={logged} goal={14} />
                                </section>
                            </div>
                            <div className="charts-grid">
                                <MacroChart summary={today} />
                                <WeekChart history={history} />
                            </div>
                            <section className="card meals-card">
                                <div className="section-heading">
                                    <h2>Today's meals</h2>
                                    <button className="text-button" onClick={() => navigate('diary')}>
                                        View diary
                                    </button>
                                </div>
                                <Meals meals={today.meals} onAdd={() => setModal({})} />
                            </section>
                        </>
                    ))}

                {page === 'database' && (
                    <section className="card database-card">
                        <h2>Explore the food database</h2>
                        <p className="muted section-description">Search a food and select it to add a serving to your diary.</p>
                        <FoodSearch onSelect={(food) => setModal({ food })} />
                    </section>
                )}

                {page === 'diary' && (
                    <section className="card meals-card">
                        <div className="section-heading">
                            <h2>Your food diary</h2>
                            <label className="date-label">
                                Date
                                <input
                                    type="date"
                                    value={date}
                                    max={localDate()}
                                    required
                                    onChange={(e) => {
                                        if (e.target.value && e.target.value !== date) {
                                            setDate(e.target.value)
                                            setDiaryLoading(true)
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <Notice error>{diaryError}</Notice>
                        {diaryError && (
                            <button className="text-button" onClick={reload}>
                                Retry
                            </button>
                        )}
                        {diaryLoading ? (
                            <p className="loading" role="status">
                                Loading meals…
                            </p>
                        ) : (
                            !diaryError && (
                                <>
                                    <div className="diary-totals">
                                        {[
                                            ['Calories', 'totalCalories', 'kcal'],
                                            ['Protein', 'totalProtein', 'g'],
                                            ['Fat', 'totalFat', 'g'],
                                            ['Carbs', 'totalCarbs', 'g'],
                                        ].map(([label, field, unit]) => (
                                            <div key={field}>
                                                <span>{label}</span>
                                                <strong>
                                                    {number(diary.reduce((sum, item) => sum + Number(item[field]), 0))}
                                                    <small> {unit}</small>
                                                </strong>
                                            </div>
                                        ))}
                                    </div>
                                    <Meals meals={diary} onDelete={setDeleteTarget} deleting={deleting} onAdd={() => setModal({})} />
                                </>
                            )
                        )}
                    </section>
                )}

                {page === 'reports' &&
                    (loading ? (
                        <p className="loading" role="status">
                            Loading your reports…
                        </p>
                    ) : error && !summary ? (
                        <div className="card empty">Your reports are unavailable. Please retry.</div>
                    ) : (
                        <>
                            <div className="charts-grid">
                                <WeekChart history={history} />
                                <section className="card report-insight">
                                    <span className="eyebrow">The bigger picture</span>
                                    <h2>{history.length ? `${history.length} days of showing up.` : 'Your next chapter starts here.'}</h2>
                                    <p>
                                        {history.length
                                            ? `You've logged ${history.reduce((sum, d) => sum + d.meals.length, 0)} meals. Keep tracking to get to know your habits.`
                                            : 'Log your first meal to start building your nutrition history.'}
                                    </p>
                                </section>
                            </div>
                            <section className="card meals-card">
                                <div className="section-heading">
                                    <h2>Nutrition history</h2>
                                    <span className="muted">Daily totals</span>
                                </div>
                                {!history.length ? (
                                    <div className="empty">
                                        <p>No history yet. Your logged meals will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="table-scroll">
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Calories</th>
                                                <th>Protein</th>
                                                <th>Fat</th>
                                                <th>Carbs</th>
                                                <th>Meals</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {history.map((day) => (
                                                <tr key={day.date}>
                                                    <td>
                                                        <button
                                                            className="text-button"
                                                            onClick={() => {
                                                                if (date !== day.date) {
                                                                    setDate(day.date)
                                                                    setDiaryLoading(true)
                                                                }
                                                                navigate('diary')
                                                            }}
                                                        >
                                                            {new Date(`${day.date}T12:00:00`).toLocaleDateString('en-GB', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </button>
                                                    </td>
                                                    <td>{number(day.totalCalories)} kcal</td>
                                                    <td>{number(day.totalProtein)}g</td>
                                                    <td>{number(day.totalFat)}g</td>
                                                    <td>{number(day.totalCarbs)}g</td>
                                                    <td>{day.meals.length}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        </>
                    ))}

                {page === 'profile' && (
                    <div className="profile-grid">
                        <section className="card profile-card">
                            <h2>Your account</h2>
                            <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
                            <dl>
                                <dt>Name</dt>
                                <dd>{user.name}</dd>
                                <dt>Email address</dt>
                                <dd>{user.email}</dd>
                            </dl>
                            <p className="muted">Your account details are managed by your sign-in provider.</p>
                            <button className="text-button profile-logout" onClick={logout} disabled={signingOut}>
                                {signingOut ? 'Signing out…' : 'Sign out'}
                            </button>
                        </section>
                        <section className="card profile-card">
                            <h2>Daily goals</h2>
                            <p className="muted section-description">
                                Set the targets shown on your dashboard. Saved in this browser for your account.
                            </p>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    const data = new FormData(event.currentTarget)
                                    const next = {
                                        calories: Number(data.get('calories')),
                                        protein: Number(data.get('protein')),
                                    }
                                    try {
                                        localStorage.setItem(storageKey, JSON.stringify(next))
                                        setGoals(next)
                                        setMessage('Your daily goals have been saved.')
                                        setError('')
                                    } catch {
                                        setError('Browser storage is unavailable. Your goals could not be saved.')
                                    }
                                }}
                            >
                                <label>
                                    Calorie goal (kcal)
                                    <input name="calories" type="number" min="1" max="20000" required defaultValue={goals.calories} />
                                </label>
                                <label>
                                    Protein goal (g)
                                    <input name="protein" type="number" min="1" max="1000" required defaultValue={goals.protein} />
                                </label>
                                <button className="button">Save goals</button>
                            </form>
                        </section>
                    </div>
                )}
            </main>

            {modal && (
                <MealModal
                    initialFood={modal.food}
                    onClose={() => setModal(null)}
                    onSaved={() => {
                        setModal(null)
                        setMessage('Meal added to your diary.')
                        reload()
                    }}
                />
            )}
            {deleteTarget && (
                <DeleteDialog
                    food={deleteTarget.foodName}
                    busy={deleting !== null}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={remove}
                />
            )}
        </div>
    )
}

function DeleteDialog({ food, busy, onClose, onConfirm }) {
    useEffect(() => {
        const prior = document.activeElement
        const dialog = document.getElementById('delete-dialog')
        dialog?.showModal()
        return () => {
            dialog?.close()
            prior?.focus()
        }
    }, [])

    return (
        <dialog
            id="delete-dialog"
            className="meal-modal delete-modal"
            aria-labelledby="delete-title"
            onCancel={(event) => {
                event.preventDefault()
                if (!busy) onClose()
            }}
        >
            <h2 id="delete-title">Remove this meal?</h2>
            <p>{food} will be removed from your diary and nutrition totals.</p>
            <div className="hero-actions">
                <button className="button secondary" disabled={busy} onClick={onClose}>
                    Keep meal
                </button>
                <button className="button delete-button" disabled={busy} onClick={onConfirm}>
                    {busy ? 'Removing…' : 'Remove meal'}
                </button>
            </div>
        </dialog>
    )
}

export default function App() {
    const [screen, setScreen] = useState('landing')
    const [user, setUser] = useState(null)
    const [authError, setAuthError] = useState('')
    const [opening, setOpening] = useState(false)

    async function open() {
        if (user) {
            setScreen('app')
            return
        }
        setOpening(true)
        try {
            setUser(await api.me())
            setScreen('app')
        } catch (err) {
            setAuthError(err.status === 401 ? '' : err.message)
            setScreen('auth')
        } finally {
            setOpening(false)
        }
    }

    const [expired] = useState(() => () => {
        setUser(null)
        setAuthError('Your session has expired. Please sign in again.')
        setScreen('auth')
    })

    if (screen === 'auth') {
        return (
            <Auth
                initialError={authError}
                onHome={() => setScreen('landing')}
                onLogin={(person) => {
                    setUser(person)
                    setScreen('app')
                    location.hash = 'dashboard'
                }}
            />
        )
    }

    if (screen === 'app' && user) {
        return (
            <Workspace
                user={user}
                onExpired={expired}
                onHome={() => setScreen('landing')}
                onLogout={() => {
                    setUser(null)
                    setScreen('landing')
                    history.replaceState(null, '', location.pathname)
                }}
            />
        )
    }

    return (
        <>
            <Landing
                onOpen={() => {
                    if (!opening) open()
                }}
            />
            {opening && (
                <div className="connection-status" role="status">
                    Connecting to your account…
                </div>
            )}
        </>
    )
}