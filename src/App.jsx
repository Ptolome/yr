import { useSelector} from 'react-redux';
import SearchForm from './components/SearchForm/SearchForm';
import BrandList from './components/BrandList/BrandList';
import PartsTable from './components/PartsTable/PartsTable';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';

import './App.scss';

function App() {

  const { 
    isSearchingBrands, 
    isFetchingOffers, 
    error, 
    brands, 
    offers 
  } = useSelector(state => state.parts);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Подбор автозапчастей</h1>
      </header>
      
      <main className="app-main">
        <SearchForm />
        
       
        {isSearchingBrands && <Loader />}
        
             
        {!isSearchingBrands && brands.length > 0 && (
          <div className="section-block">
            <BrandList />
          </div>
        )}
          {error && <ErrorMessage message={error} />}
       
        {!isSearchingBrands && offers.length > 0 && (
          <div className="section-block">
         
            <PartsTable isLoading={isFetchingOffers} />
          </div>
        )}

    
      </main>
    </div>
  );
}

export default App;