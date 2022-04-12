// Icons
import { Home, Dvr, AppSettingsAlt } from '@mui/icons-material';

// Pages
import HomePage from '../pages/Home';
import Alunos from '../pages/Alunos';
import Cursos from '../pages/Cursos';


const routesList = [
  { path: "/inicio", name: "Início", component: <HomePage />, icon: <Home /> },
  { path: "/alunos", name: "Alunos", component: <Alunos />, icon: <Dvr /> },
  // { path: "/cursos", name: "Cursos", component: <Cursos />, icon: <AppSettingsAlt /> },
]

export default routesList;