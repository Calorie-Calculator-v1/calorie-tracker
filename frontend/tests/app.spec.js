import { test, expect } from '@playwright/test'

const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
async function mockBackend(page) {
  let signedIn = false
  let meals = [{ id: 1, foodName: 'Chicken breast', quantity: 1.5, totalCalories: 248, totalProtein: 46, totalFat: 5, totalCarbs: 0, mealType: 'Lunch', loggedDate: today }]
  const writes = []
  await page.route('**/api/v1.0/**', async route => {
    const request = route.request(), url = new URL(request.url()), path = url.pathname.replace('/api/v1.0', '')
    const json = data => route.fulfill({ json: data })
    if (path === '/login') { signedIn = true; writes.push(request.postDataJSON()); return route.fulfill({ body: 'Login Successful' }) }
    if (path === '/register') { writes.push(request.postDataJSON()); return route.fulfill({ body: 'User registered successfully' }) }
    if (!signedIn) return route.fulfill({ status: 401 })
    if (path === '/me') return route.fulfill({ body: 'Current User: Drashti Patel, Email: drashti@example.com' })
    if (path === '/logout') { signedIn = false; return route.fulfill({ body: 'Logout successful' }) }
    if (path === '/foods/search') return json([{ id: 22, name: 'Brown rice', caloriesPerServing: 112 }])
    if (path === '/me/foodlog' && request.method() === 'POST') {
      const data = request.postDataJSON(); writes.push(data)
      meals.push({ id: 2, foodName: 'Brown rice', quantity: data.quantity, totalCalories: data.quantity * 112, totalProtein: 5, totalCarbs: 46, totalFat: 2, mealType: data.mealType, loggedDate: data.loggedDate })
      return json({ id: 2 })
    }
    if (request.method() === 'DELETE') { meals = meals.filter(m => m.id !== Number(path.split('/').at(-1))); return route.fulfill({ body: 'Deleted log' }) }
    const day = { date: today, meals, totalCalories: meals.reduce((s, m) => s + m.totalCalories, 0), totalProtein: 51, totalCarbs: 46, totalFat: 7 }
    if (path.endsWith('/summary')) return json(day)
    if (path.endsWith('/history')) return json([day])
    if (path === '/me/foodlog') return json(url.searchParams.get('date') === today ? meals : [])
    return route.fulfill({ status: 404 })
  })
  return writes
}
async function signIn(page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open dashboard' }).first().click()
  await page.getByLabel('Email address').fill('drashti@example.com')
  await page.getByLabel('Password', { exact: true }).fill('password123')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.getByRole('heading', { name: /Good .*Drashti/ })).toBeVisible()
}
test('landing matches the requested structure at desktop and mobile sizes', async ({ page }) => {
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await expect(page.getByRole('heading', { name: "Know exactly what's on your plate." })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Gainly home' })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `test-results/landing-${viewport.width}.png`, fullPage: true })
  }
})
test('sign in, search, log servings, refresh totals, inspect diary, delete and sign out', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message))
  const writes = await mockBackend(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await signIn(page)
  await expect(page.getByRole('cell', { name: 'Chicken breast' })).toBeVisible()
  await page.screenshot({ path: 'test-results/dashboard-1440.png', fullPage: true })
  await page.getByRole('button', { name: 'Food database', exact: true }).click()
  await page.getByRole('searchbox').fill('brown rice')
  await page.getByRole('button', { name: /Brown rice/ }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByLabel('Number of servings').fill('2')
  await page.getByRole('button', { name: 'Add to diary' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(writes.at(-1)).toEqual({ foodId: 22, quantity: 2, mealType: 'Lunch', loggedDate: today })
  await page.getByRole('button', { name: 'Dashboard', exact: true }).click()
  await expect(page.getByRole('cell', { name: 'Brown rice', exact: true })).toBeVisible()
  await expect(page.locator('.stat-value').first()).toContainText('472')
  await page.getByRole('button', { name: 'View diary' }).click()
  await page.getByRole('button', { name: 'Delete Brown rice' }).click()
  await page.getByRole('button', { name: 'Remove meal', exact: true }).click()
  await expect(page.getByRole('cell', { name: 'Brown rice', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Reports', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Nutrition history' })).toBeVisible()
  await page.getByRole('button', { name: 'Profile', exact: true }).click()
  await page.getByLabel('Calorie goal (kcal)').fill('2100')
  await page.getByRole('button', { name: 'Save goals' }).click()
  await page.getByRole('button', { name: 'Dashboard', exact: true }).click()
  await expect(page.locator('.stat-value').first()).toContainText('2,100')
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/dashboard-390.png', fullPage: true })
  await page.getByRole('button', { name: 'Profile', exact: true }).click()
  await page.locator('.profile-logout').click()
  await expect(page.getByRole('heading', { name: "Know exactly what's on your plate." })).toBeVisible()
  expect(errors).toEqual([])
})
test('registration sends the backend username field and explains verification', async ({ page }) => {
  const writes = await mockBackend(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Open dashboard' }).first().click()
  await page.getByRole('button', { name: 'Create an account' }).click()
  await page.getByLabel('Your name').fill('Drashti')
  await page.getByLabel('Email address').fill('drashti@example.com')
  await page.getByLabel('Password', { exact: true }).fill('password123')
  await page.getByRole('button', { name: 'Create account', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Check your email')
  expect(writes[0]).toEqual({ username: 'Drashti', email: 'drashti@example.com', password: 'password123' })
})
test('connection failure is actionable and never presents a fake dashboard', async ({ page }) => {
  await page.route('**/api/v1.0/**', route => route.abort('connectionrefused'))
  await page.goto('/')
  await page.getByRole('button', { name: 'Open dashboard' }).first().click()
  await expect(page.getByRole('alert')).toContainText('Cannot reach the server')
  await expect(page.getByRole('heading', { name: /Good .*Drashti/ })).toHaveCount(0)
})
