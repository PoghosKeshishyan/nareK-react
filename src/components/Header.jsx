export function Header({ header }) {
  return (
    <header>
      <h1>{header.title}</h1>
      <div className="logo" style={{backgroundImage: `url(${header.logo})`}}/>
    </header>
  )
}
