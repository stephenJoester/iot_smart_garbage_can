import './App.css';
import Header from './components/Header';
import MainContent from './components/MainContent.jsx';

function App() {
  return (
    <div className='h-screen w-full'>
      <div className='h-[25vh]'>
        <Header/>
      </div>
      <main className='h-[80vh]'>
        <MainContent/>
      </main>
    </div>
  );
}

export default App;
