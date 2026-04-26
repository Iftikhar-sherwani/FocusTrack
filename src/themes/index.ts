import { boxingTheme } from './boxing'
import { dashboardTheme } from './dashboard'
import { footballTheme } from './football'
import { formula1Theme } from './formula1'
import { militaryTheme } from './military'
import { minimalTheme } from './minimal'

export const themes = [dashboardTheme, formula1Theme, footballTheme, boxingTheme, militaryTheme, minimalTheme]

export const defaultTheme = dashboardTheme

export const getThemeById = (id: string) => themes.find((theme) => theme.id === id) ?? defaultTheme
