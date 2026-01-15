/**
 * Socket.IO Configuration
 * Manages real-time notifications
 */

let io;

/**
 * Initialize Socket.IO
 */
const initIO = (socketIO) => {
  io = socketIO;
};

/**
 * Get Socket.IO instance
 */
const getIO = () => {
  if (!io) {
    console.warn('Socket.IO not initialized yet');
    return { emit: () => {} }; // Return dummy object to prevent crashes
  }
  return io;
};

module.exports = {
  initIO,
  getIO
};
