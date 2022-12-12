  // Moduuli, joka vie kurssin dataa komponentilta toiselle ja huolehtii sen tulostumisesta näytölle
  const Course = ({course}) =>(
    <div><Header key={course.id} course = {course}/></div>
    )

  // Tulostaa kurssin nimen sekä kurssin yhteenlaskettujen tehtävien määrän
  // Vie dataa muille komponenteille, jotka huolehtivat kurssin lopun sisällön renderöinnistä 
  const Header = ({course}) => {
    const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    return(
      <div key={course.id}><h3><b>{course.name}</b></h3>
      <Content parts = {course.parts}/>
      <p><b>Total of {total} exercises</b></p>
      </div>
    )
  }
  
  // Huolehtii yksittäisen kurssin kaikista aihepiireistä
  const Content = ({parts}) => (
    <div>{parts.map(part => <Part key = {part.id} part = {part}/>)}</div>
  )
  
  // Vastuussa yksittäisen aihepiirin tietojen renderöinnistä
  const Part = ({part}) =>(
    <p key={part.key}>{part.name} {part.exercises}</p>
  )

  export default Course