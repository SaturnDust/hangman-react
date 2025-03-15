import { useState } from "react"
import { languages } from "./static_data/languages.jsx"
import { clsx } from "clsx" 
import { getFarewellText, getRandomWord } from "./utils/utils.js"
import Confetti from "react-confetti"
import {useWindowSize} from '@react-hook/window-size' 


export default function AssemblyEndgame() {

    //state value
    const [currentWord, setCurrentWord] = useState(getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState([])

    //static value
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const { widthConft, heightConft } = useWindowSize()
    

    //derived values
    let wrongGuessCount = 0;
    guessedLetters.forEach(letter => {
        if(!currentWord.includes(letter))
            wrongGuessCount++;
    });
    
    let isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter));
    let isGameLost = wrongGuessCount === languages.length - 1;
    let isGameOver = isGameWon || isGameLost;
    

    function addGuessedLetter(letter) {
        setGuessedLetters(prevLetters =>
            prevLetters.includes(letter) ?
                prevLetters :
                [...prevLetters, letter]
        )
    }

    const languageElements = languages.map((lang, index) => {
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }

        const isLost = index < wrongGuessCount;
        const className = clsx({
            lost : isLost
        });

        return (
            <span
                className={`chip ${className}`}
                style={styles}
                key={lang.name}
            >
                {lang.name}
            </span>
        )
    })

    const letterElements = currentWord.split("").map((letter, index) => (
        <span key={index}>
            {guessedLetters.includes(letter) ? letter.toUpperCase() : ''}
        </span>
    ));

    const keyboardElements = alphabet.split("").map(letter => {
        
        const isGuessed = guessedLetters.includes(letter);
        const isCorrect = isGuessed && currentWord.includes(letter);
        const isWrong = isGuessed && !currentWord.includes(letter);
        const className = clsx({
            correct : isCorrect,
            wrong : isWrong
        })        

        return (
            <button
                className={className}
                key={letter}
                onClick={() => addGuessedLetter(letter)}
                disabled={isGameOver}
            >
                {letter.toUpperCase()}
            </button>
        )
    })

    
    // return : bahasa-bahasa yang tumbang
    const lastGuess = guessedLetters[guessedLetters.length - 1];
    const isLastguessWrong = lastGuess && !currentWord.includes(lastGuess);
    
    let farewellLang = '';
    
    if (isLastguessWrong) {
        farewellLang = languages.slice(0, wrongGuessCount).map(item => item.name).join(' & ');
    }

    function renderGameStatus(farewellLang, wrongGuessCount){
        if(farewellLang && wrongGuessCount <= 7){
            return(<>
                <p>{getFarewellText(farewellLang)}🙏</p>
            </>)
        }else if(!isGameOver){
            return null
        } else {

            if(isGameWon){
                return (
                    <>
                        <h2>You win!</h2>
                        <p>Well done! 🎉</p>
                    </>
                )
            } else{
                return(<>
                    <h2>Game over! it's {currentWord}</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
                )
            }

        }
    }

    const gameStatusClass = clsx("game-status", {
        won : isGameWon,
        lost : isGameLost,
        farewell : isLastguessWrong && wrongGuessCount < 8
        
    })

    function handleNewGame(){
        window.location.reload()
    }

    return (
        <main>
            {isGameWon && <Confetti width={widthConft} height={heightConft} recycle={false} />}
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word within 8 attempts to keep the
                programming world safe from Assembly!</p>
            </header>

            <section className={gameStatusClass}>
                {renderGameStatus(farewellLang, wrongGuessCount)}
            </section>

            <section className="language-chips">
                {languageElements}
            </section>
            <section className="word">
                {letterElements}
            </section>
            <section className="keyboard">
                {keyboardElements}
            </section>
            {
            isGameOver &&
            <button className="new-game" onClick={handleNewGame}>New Game</button>
            }
        </main>
    )
}