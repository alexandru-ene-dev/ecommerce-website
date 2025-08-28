import { createContext, useContext, useState, type ReactNode } from 'react';

type AvatarContextType = {
  avatar: string | null;
  setAvatar: (avatar: string | null) => void;
};


const AvatarContext = createContext<AvatarContextType | null>(null);


export const AvatarProvider = ({ children }: { children: ReactNode }) => {
  const [avatar, setAvatar] = useState<string | null>(null);

  return (
    <AvatarContext.Provider value={{ avatar, setAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};


export const useAvatar = (): AvatarContextType => {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }

  return context;
};
