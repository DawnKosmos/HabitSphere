# Habit Tracker PWA

A simple Progressive Web App (PWA) for tracking daily habits. This app allows you to create habits with boolean (yes/no) or numeric responses and track them daily.

## Features

- Create, edit, and delete habits
- Track habits daily with yes/no or numeric values
- Navigate between days to view and update past tracking
- Dark mode by default
- Works offline (PWA)
- Mobile-friendly design
- Data stored locally on your device

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```
   cd /Users/martinhottmann/GolandProjects/habittracker/webversion
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

To create a production build:

```
npm run build
```
or
```
yarn build
```

The build files will be in the `build` directory and can be deployed to any static hosting service.

## Usage

1. **Adding a Habit**: Click the + button in the top-right corner to add a new habit. Specify a name, optional description, and whether it's a yes/no habit or a numeric habit.

2. **Tracking Habits**: On the "Today" tab, toggle the switch for yes/no habits or enter a number for numeric habits.

3. **Managing Habits**: Go to the "Habits" tab to view, edit, or delete your habits.

4. **Navigating Days**: Use the arrow buttons at the top of the "Today" tab to navigate between days.

## Technologies Used

- React
- Material-UI
- LocalForage (for offline storage)
- Date-fns (for date handling)
- PWA capabilities

## License

This project is open source and available under the MIT License.
