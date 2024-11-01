import './App.css';
import Header from './components/Header';
import MainContent from './components/MainContent.jsx';

function App() {
  return (
    <div className='h-screen w-full'>
      <div className='h-1/5'>
        <Header/>
      </div>
      <main className='h-4/5'>
        <MainContent/>
      </main>
    </div>
  );
}

export default App;
