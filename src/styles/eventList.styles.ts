import { SxProps } from '@mui/material';

export const eventListStyles = {
  container: {
    py: 4
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    mb: 4
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
    gap: 4
  },
  calendarWrapper: {
    flex: 1,
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 1,
    overflow: 'hidden',
    height: '100vh'
  },
  calendar: {
    width: '100%',
    height: '100%',
    '& .MuiDayCalendar-weekContainer': {
      margin: 0,
      minHeight: '120px',
    },
    '& .MuiPickersDay-root': {
      height: '120px',
      width: '100%',
      borderRadius: 0,
      border: '1px solid',
      borderColor: 'divider',
      margin: 0,
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
      pl: 1
    },
    '& .MuiPickersDay-dayOutsideMonth': {
      opacity: 0.5,
      pointerEvents: 'none',
      backgroundColor: '#f5f5f5',
    }
  },
  dayCell: {
    height: '100%',
    width: '100%',
    p: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  },
  dayNumber: {
    fontSize: '1rem',
    mb: 0.5,
    textAlign: 'left'
  },
  eventContainer: {
    flex: 1,
    overflow: 'hidden'
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