import { SxProps } from '@mui/material';

export const eventListStyles = {
  container: {
    py: 4
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    mb: 4,
    minWidth: '800px'
  },
  createButton: {
    ml: 'auto',
    bgcolor: '#1a73e8',
    '&:hover': {
      bgcolor: '#1557b0'
    }
  },
  calendarContainer: {
    display: 'flex',
    gap: 4,
    minWidth: '800px',
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      height: '8px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px',
      '&:hover': {
        background: '#555'
      }
    }
  },
  calendarWrapper: {
    flex: 1,
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 1,
    overflow: 'hidden',
  },
  calendar: {
    width: '100%',
    height: '100vh',
    '& .MuiPickersCalendarHeader-root': {
      paddingLeft: 2,
      paddingRight: 2,
      marginTop: 1,
      marginBottom: 1
    },
    '& .MuiDayCalendar-header': {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 0
    },
    '& .MuiDayCalendar-weekContainer': {
      margin: 0,
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 0
    },
    '& .MuiPickersDay-root': {
      width: '100%',
      height: '100%',
      borderRadius: 0,
      border: '1px solid',
      borderColor: 'divider',
      margin: 0,
      padding: 0,
      '&:hover': {
        backgroundColor: 'action.hover',
      },
      '&.Mui-selected': {
        backgroundColor: 'transparent',
        color: 'text.primary',
      }
    },
    '& .MuiDayCalendar-weekDayLabel': {
      textTransform: 'uppercase',
      fontWeight: 500,
      width: '100%',
      fontSize: '0.75rem',
      textAlign: 'left',
      pl: 1,
      margin: 0
    },
    '& .MuiPickersDay-dayOutsideMonth': {
      opacity: 0.5,
      pointerEvents: 'none',
      backgroundColor: '#f5f5f5',
    }
  },
  dayCell: {
    height: '120px',
    width: '120px',
    p: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    border: '1px solid',
    borderColor: 'divider'
  },
  dayNumber: {
    fontSize: '1rem',
    mb: 0.5,
    textAlign: 'left'
  },
  eventContainer: {
    flex: 1,
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '4px'
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#bbb',
      borderRadius: '4px'
    }
  },
  eventItem: {
    backgroundColor: '#1a73e8',
    color: '#ffffff',
    p: 0.5,
    borderRadius: '4px',
    mb: 0.5,
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#1557b0',
    }
  },
  popoverContent: {
    p: 2,
    maxWidth: 400
  },
  popoverActions: {
    mt: 2,
    display: 'flex',
    gap: 1,
    justifyContent: 'flex-end'
  }
} as const; 