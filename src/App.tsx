import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import "./common/Styles.css"
import LandingView from './components/LandingView/LandingView';
import { BookOverview, TranslationOverview } from './models/dto';
import BibleApi from './helpers/BibleApi';
import DetailedView from './components/DetailedView/DetailedView';
import NoView from './components/NoView/NoView';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChapterView from './components/ChapterView/ChapterView';
import VerseView from './components/VerseView/VerseView';

interface State {
  translationOverviews: Array<TranslationOverview>
  selectedTranslation?: TranslationOverview
}

function App() {

  const initState: State = {
    translationOverviews : []
  }

  const [state, setState] = useState<State>(initState)

  const refDetailedView = useRef<HTMLDivElement>(null);

  const fetchAndUpdate = async () => {
    const apiResponse = await BibleApi.getInstance().getAllTranslationOverviews();
    setState(prevState => ({
      ...prevState,
      translationOverviews: apiResponse
    }));
  }

  useEffect(() => {
    fetchAndUpdate();
  }, []);

  const onTranslationSelection = (i: number) => {
    setState(prevState => ({
      ...prevState,
      selectedTranslation: prevState.translationOverviews[i]
    }))
    refDetailedView?.current?.scrollIntoView({ behavior: "smooth" });
  }

  const homeDiv = (
    <div>
      { 
        (state.translationOverviews && state.translationOverviews.length > 0) 
          ? <LandingView 
              availableTranslations={ state.translationOverviews }
              onTranslationSelection={ onTranslationSelection } />
          : null             
      }
      <div ref={ refDetailedView }>
        {
          state.selectedTranslation ? 
            <DetailedView selectedTranslation={ state.selectedTranslation }/> : 
            <NoView message='Please select a Translation to see details' />
        }
      </div>
    </div>
  )

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path={ '/' } element={ homeDiv } />
          <Route path={ '/:tCode/:bCode/chapter' } element={ <ChapterView /> } />
          <Route path={ '/:tCode/:bCode/verse' } element={ <VerseView /> } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
