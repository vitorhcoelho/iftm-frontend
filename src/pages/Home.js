import React, { useEffect } from "react";

// Redux
import { fetchAllAlunos } from "../model/alunosStore";
import { useSelector, useDispatch } from 'react-redux';

function Home() {
  const dispatch = useDispatch();
  const { } = useSelector((state) => state.alunos);

  function retrieveAlunosList() {
    dispatch(fetchAllAlunos())
  }

  useEffect(() => {
    retrieveAlunosList();
  }, []);

  return (
    <div className="App">
    </div>
  );
}

export default Home;