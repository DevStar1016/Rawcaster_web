/**
 * A React context provider component that allows components to subscribe to and emit events.
 * @param {React.ReactNode} children - The child components to render within the provider.
 * @returns The EventProvider component.
 */
import React, { createContext, useContext, useRef, useState } from "react";

const EventContext = createContext({});

export const useEvent = () => {
  return useContext(EventContext);
};

const EventProvider = ({ children }) => {
  const EventsRef = useRef({});

  /**
   * Subscribes a callback function to an event.
   * @param {string} eventName - The name of the event to subscribe to.
   * @param {any} callback - The callback function to be executed when the event is triggered.
   * @returns None
   */
  const subscribe = (eventName: string, callback: any) => {
    let eventValues = { ...EventsRef.current };
    if (!eventValues[eventName]) {
      eventValues[eventName] = [];
    }
    eventValues[eventName].push(callback);
    EventsRef.current = { ...eventValues };
  };

  /**
   * Unsubscribes from an event by removing all event listeners associated with the given event name.
   * @param {string} eventName - The name of the event to unsubscribe from.
   * @returns None
   */
  const unsubscribe = (eventName: string) => {
    let eventValues = { ...EventsRef.current };
    if (!eventValues[eventName]) {
      eventValues[eventName] = [];
    }
    eventValues[eventName] = [];
    EventsRef.current = { ...eventValues };
  };

  /**
   * Emits an event with the given event name and data.
   * @param {string} eventName - The name of the event to emit.
   * @param {any} data - The data to pass along with the event.
   * @returns None
   */
  const emit = (eventName: string, data: any) => {
    const eventCallbacks = EventsRef.current[eventName] || [];
    eventCallbacks.forEach((callback: any) => callback(data));
  };

  return (
    <EventContext.Provider value={{ subscribe, emit, unsubscribe }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;
