const links = ['about', 'experience', 'skills', 'projects', 'education', 'contact']
export default function Navbar() {
  return (
    <header className="nav">
      <a href="#home" className="logo">Sujal Shrestha</a>
      <nav>{links.map((l) => <a key={l} href={`#${l}`}>{l}</a>)}</nav>
    </header>
  )
}
