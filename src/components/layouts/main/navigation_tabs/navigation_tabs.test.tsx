import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NavigationTabs from './navigation_tabs'

describe('NavigationTabs', () => {
  it('renders all tabs with correct labels', () => {
    render(<NavigationTabs />)
    
    // Check if all tab labels are present
    expect(screen.getByText('Develop')).toBeInTheDocument()
    expect(screen.getByText('Deploy')).toBeInTheDocument()
    expect(screen.getByText('Monitor')).toBeInTheDocument()
  })

  it('has "develop" as the default selected tab', () => {
    render(<NavigationTabs />)
    
    const developTab = screen.getByRole('tab', { name: /develop/i })
    expect(developTab).toHaveAttribute('data-state', 'active')
  })

  it('allows switching between tabs', async () => {
    render(<NavigationTabs />)
    const user = userEvent.setup()

    // Click on Deploy tab
    const deployTab = screen.getByRole('tab', { name: /deploy/i })
    await user.click(deployTab)
    expect(deployTab).toHaveAttribute('data-state', 'active')

    // Initial tab should no longer be active
    const developTab = screen.getByRole('tab', { name: /develop/i })
    expect(developTab).toHaveAttribute('data-state', 'inactive')
  })

  it('renders all icons', () => {
    render(<NavigationTabs />)
    
    // Check if we have the correct number of icons
    const icons = document.querySelectorAll('svg')
    expect(icons).toHaveLength(3)
  })
})