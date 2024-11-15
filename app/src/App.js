import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import MainContent from './components/MainContent.jsx';

function App() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const handleRefreshClick = () => {
    setRefreshFlag(!refreshFlag); 
  };
  return (
    <div className='h-screen w-full'>
      <div className='h-[25vh]'>
        <Header onRefresh={handleRefreshClick}/>
      </div>
      <main className='h-[80vh]'>
        <MainContent refreshFlag={refreshFlag}/>
      </main>
    </div>
  );
}

export default App;
