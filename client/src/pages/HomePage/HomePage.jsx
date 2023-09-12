import React from 'react';
import './HomePage.css';


import {LastRecosList} from '../../components/LastRecosList/LastRecosList';
import { LastMemesList } from '../../components/LastMemesList/LastMemesList';
import { LastFanartList } from '../../components/LastFanartList/LastFanartList';
import { LastCosplaysList } from '../../components/LastCosplaysList/LastCosplaysList';
import { LastOpeningsList } from '../../components/LastOpeningsList/LastOpeningsList';
import { LastTeoriasList } from '../../components/LastTeoriasList/LastTeoriasList';


function HomePage() {


    return (
        <main className="home-page">
            <LastMemesList endpoint={"http://localhost:3001/entries/memes"}/>
            <LastRecosList endpoint={"http://localhost:3001/entries/recomendaciones"}/>
            <LastFanartList endpoint={"http://localhost:3001/entries/fanArt"}/>
            <LastCosplaysList endpoint={"http://localhost:3001/entries/cosplays"}/>
            <LastOpeningsList endpoint={"http://localhost:3001/entries/openings"}/>
            <LastTeoriasList endpoint={"http://localhost:3001/entries/teorias"} />
            
       
          
   
        </main>
    )
}

export {HomePage};