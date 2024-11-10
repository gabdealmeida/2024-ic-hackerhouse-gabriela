import { useState } from "react";
import NfidLogin from "./components/NfidLogin";

function App() {
  const [backendActor, setBackendActor] = useState();
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [paragraphScore, setParagraphScore] = useState();
  const [paragraphSentiment, setParagraphSentimentRes] = useState();

  function handleSubmitUserProfile(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    backendActor.setUserProfile(name).then((response) => {
      if (response.ok) {
        setUserId(response.ok.id.toString());
        setUserName(response.ok.name);
      } else if (response.err) {
        setUserId(response.err);
      } else {
        console.error(response);
        setUserId("Unexpected error, check the console");
      }
    });
    return false;
  }

  function handleSubmitUserParagraph(event) {
    event.preventDefault();
    const paragraph = event.target.elements.paragraph.value;

    backendActor
      .outcall_ai_model_for_sentiment_analysis(paragraph)
      .then((response) => {
        var res = {
          paragraph: paragraph,
          result: text_response,
          maxScore: max_score,
          sentimentRes: sentiment_res,
        };

        if (res.ok) {
          setParagraphScore(res.ok.maxScore);
          setParagraphSentimentRes(res.ok.sentimentRes);
        } else if (response.err) {
          setParagraphSentimentRes(response.err);
        } else {
          console.error(response);
          setUserId("Unexpected error, check the console");
        }
      });

    return false;
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <h1 className="main-title">Welcome to IC AI Hacker House!</h1>
      {!backendActor && (
        <section id="nfid-section">
          <NfidLogin setBackendActor={setBackendActor}></NfidLogin>
        </section>
      )}
      {backendActor && (
        <>
          <form action="#" onSubmit={handleSubmitUserProfile}>
            <label htmlFor="name">Enter your name:</label>
            <input id="name" alt="Name" type="text" />
            <button type="submit" className="send-button">
              Save
            </button>
          </form>
          {userId && <section className="response">{userId}</section>}
          {userName && <section className="response">{userName}</section>}

          <form action="#" onSubmit={handleSubmitUserParagraph}>
            <label htmlFor="paragraph" className="form-label">
              Type a phrase for Sentiment Analysis:
            </label>
            <input id="paragraph" alt="Paragraph" type="text" />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
          {paragraphScore && paragraphSentiment && (
            <section className="response">
              The detected sentiment is {paragraphSentiment} with a confidence
              level of {paragraphScore}.
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default App;
