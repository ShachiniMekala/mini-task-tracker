import React, { createContext, useContext, useState, useEffect } from 'react';
import { configService } from '../api/config.service';
import { toast } from 'react-hot-toast';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const [statusesRes, prioritiesRes] = await Promise.all([
        configService.getStatuses(),
        configService.getPriorities()
      ]);
      setStatuses(statusesRes.data);
      setPriorities(prioritiesRes.data);
    } catch (error) {
      console.error('Error fetching config:', error);
      toast.error('Failed to load application configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigContext.Provider value={{ statuses, priorities, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

