import PageHero from '../components/PageHero'
import './About.css'

function About() {
  return (
    <div className="about">
      <PageHero
        eyebrow="Our Church"
        title="About Cornerstone Family Chapel"
        subtitle="A community of faith committed to worship, growth, and service"
      />
      <div className="page-body">
        <div className="container">
          <div id="our-church" className="content-card fade-up">
            <h2>A Church Growing Together</h2>
            <p>
              Cornerstone Family Chapel continues to grow through the dedication and commitment of its congregation. We are grateful for the way members come together to support one another, deepen their faith, and serve others.
            </p>
            <p>
              Our church life includes Bible teaching, membership development, worship, conferences, family enrichment, children&apos;s ministry, and community outreach. Through these activities, we seek to create an environment where people can learn, connect, serve, and grow.
            </p>
          </div>

          <div className="content-card fade-up">
            <h2>Growing Deeper in God&apos;s Word</h2>
            <p>
              The Word of God is central to our growth as a church.
            </p>
            <p>
              Through Bible studies, teaching sessions, membership classes, and conferences, we create opportunities for people to explore Scripture, ask questions, share insights, and apply God&apos;s teachings to everyday life.
            </p>
            <p>
              Our use of The Good Soil as Bible-study material reflects our desire for the whole church to continually soak in God&apos;s Word and grow together in understanding and faith.
            </p>
          </div>

          <div className="content-card fade-up">
            <h2>Our Mission & Vision</h2>
            <p><em>Official mission and vision statements to be updated.</em></p>
          </div>

          <div className="content-card fade-up">
            <h2>What We Believe</h2>
            <p><em>Statement of faith to be updated.</em></p>
          </div>

          <div className="content-card fade-up">
            <h2>Service Times</h2>
            <p><em>Service times to be updated.</em></p>
          </div>

          <div className="content-card fade-up">
            <h2>Our Location</h2>
            <p><em>Address to be updated.</em></p>
            <p><em>Phone to be updated.</em></p>
            <p><em>Email to be updated.</em></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
