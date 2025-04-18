import { NavLink } from "react-router-dom";
import styled from "styled-components";
import threeM from "../../../assets/images/3m.svg";
import barstool from "../../../assets/images/barstool-store.svg";
import budweiser from "../../../assets/images/budweiser.svg";
import buzzfeed from "../../../assets/images/buzzfeed.svg";
import forbes from "../../../assets/images/forbes.svg";
import macys from "../../../assets/images/macys.svg";
import menshealth from "../../../assets/images/menshealth.svg";
import mrbeast from "../../../assets/images/mrbeast.svg";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const Wrapper = styled.section`
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* Hero Section */
  .hero_section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    padding: 4rem 0;
    
    margin-top: 4rem;
  }

  .hero_content {
    flex: 1;
    text-align: left;
    h1 {
      font-size: 3.5rem;
      font-family: "Poppins", sans-serif;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      color: #2d3748;
    }
    p {
      font-size: 1.2rem;
      color: #4a5568;
      margin-bottom: 2rem;
    }
  }

  .exp {
    margin-top: 1rem;
    padding: 12px 24px;
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;

    &:hover {
      background-color: #4338ca;
      transform: translateY(-2px);
    }
  }

  .hero_image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lerning {
    width: 100%;
    max-width: 500px;
    filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1));
  }

  /* Stats Section */
  .stats_section {
    background-color: #f8fafc;
    padding: 4rem 0;
    margin: 3rem 0;
  }

  .stats_container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    text-align: center;
  }

  .stat_item {
    h2 {
      font-size: 3rem;
      color: #4f46e5;
      margin-bottom: 0.5rem;
    }
    p {
      color: #64748b;
      font-size: 1.1rem;
    }
  }

  /* Brand Section */
  .brand_section {
    position: relative;
    margin: 5rem 0;
    padding: 3rem 0;
    background-color: #f1f5f9;
    overflow: hidden;
  }

  .brand_heading {
    text-align: center;
    margin-bottom: 2rem;
    color: #334155;
  }

  .slider_track {
    display: flex;
    width: calc(250px * 16); /* Double the items for seamless loop */
    animation: scroll 30s linear infinite;
  }

  .slide {
    height: 80px;
    width: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;

    img {
      max-height: 60px;
      max-width: 180px;
      filter: grayscale(100%);
      opacity: 0.7;
      transition: all 0.3s ease;

      &:hover {
        filter: grayscale(0);
        opacity: 1;
      }
    }
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-250px * 8)); /* Move by half the width */
    }
  }

  /* Courses Preview */
  .courses_section {
    padding: 4rem 0;
  }

  .section_heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h2 {
      font-size: 2rem;
      color: #1e293b;
    }

    a {
      color: #4f46e5;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .courses_grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }

  .course_card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
  }

  .course_image {
    height: 160px;
    width: 100%;
    object-fit: cover;
  }

  .course_content {
    padding: 1.5rem;

    h3 {
      margin-bottom: 0.5rem;
      color: #1e293b;
    }

    .instructor {
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 1rem;

      .stars {
        color: #f59e0b;
      }

      .count {
        color: #64748b;
        font-size: 0.9rem;
      }
    }

    .price {
      font-weight: 700;
      color: #1e293b;
      font-size: 1.2rem;
    }
  }

  /* Testimonials */
  .testimonials_section {
    background-color: #4f46e5;
    padding: 5rem 0;
    color: white;
  }

  .testimonials_heading {
    text-align: center;
    margin-bottom: 3rem;

    h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    p {
      opacity: 0.8;
      max-width: 600px;
      margin: 0 auto;
    }
  }

  .testimonials_grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .testimonial_card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 2rem;
    border-radius: 8px;
    position: relative;

    .quote_icon {
      position: absolute;
    top: 4px;
    left: 4px;
    opacity: 0.2;
    font-size: 2.2rem;
    }

    .content {
      margin-bottom: 1.5rem;
      line-height: 1.6;
      position: relative;
      z-index: 1;
    }

    .author {
      display: flex;
      align-items: center;
      gap: 1rem;

      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
      }

      .author_info {
        h4 {
          margin-bottom: 0.2rem;
        }

        p {
          opacity: 0.7;
          font-size: 0.9rem;
        }
      }
    }
  }

  /* Video Section */
  .learning_video {
    padding: 4rem 0;
    text-align: center;

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: #1e293b;
    }

    video {
      width: 80%;
      max-width: 800px;
      border-radius: 8px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
  }

  /* CTA Section */
  .cta_section {
    background-color: #f8fafc;
    padding: 5rem 0;
    text-align: center;

    h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #1e293b;
    }

    p {
      max-width: 600px;
      margin: 0 auto 2rem;
      color: #64748b;
    }
  }

  @media (max-width: 768px) {
    .hero_section {
      flex-direction: column;
      padding: 2rem 0;
      text-align: center;

      .hero_content {
        text-align: center;
        h1 {
          font-size: 2.5rem;
        }
      }
    }

    .slide {
      width: 200px;
    }

    .learning_video video {
      width: 95%;
    }
  }

  @media (max-width: 480px) {
    .hero_content h1 {
      font-size: 2rem;
    }

    .stats_container {
      grid-template-columns: 1fr;
    }

    .slide {
      width: 150px;
    }
  }
`;

const Home: React.FC = () => {
  // Sample courses data
  const featuredCourses = [
    {
      id: 1,
      title: "Advanced JavaScript Concepts",
      instructor: "Sarah Johnson",
      rating: 4.8,
      students: 1250,
      price: "$89.99",
      image: "../../../../public/images/thum3.avif",
    },
    {
      id: 2,
      title: "React Native Masterclass",
      instructor: "Mike Chen",
      rating: 4.9,
      students: 980,
      price: "$99.99",
      image: "../../../../public/images/thum4.avif",
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      instructor: "Emma Rodriguez",
      rating: 4.7,
      students: 2100,
      price: "$79.99",
      image: "../../../../public/images/thum5.avif",
    },
  ];

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      content:
        "This platform completely transformed my career. The courses are well-structured and the instructors are top-notch.",
      author: "Alex Turner",
      role: "Frontend Developer",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      content:
        "I've taken many online courses, but none compare to the quality and depth of the content here. Highly recommended!",
      author: "Priya Patel",
      role: "UX Designer",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      content:
        "The hands-on projects helped me build a portfolio that landed me my dream job. Worth every penny!",
      author: "Jamal Williams",
      role: "Full Stack Developer",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    },
  ];

  // Brand logos array (duplicated for seamless looping)
  const brandLogos = [
    threeM,
    barstool,
    budweiser,
    buzzfeed,
    forbes,
    macys,
    menshealth,
    mrbeast,
    threeM,
    barstool,
    budweiser,
    buzzfeed,
    forbes,
    macys,
    menshealth,
    mrbeast,
  ];

  return (
    <Wrapper className="home">
      <div className="container">
        {/* Hero Section */}
        <div className="hero_section">
          <div className="hero_content">
            <h1>Learn From the Experts</h1>
            <p>
              Access valuable content at reasonable prices and take your skills
              to the next level with our industry-leading courses.
            </p>
            <NavLink to="./course">
              <button className="exp">
                Explore Courses <IoIosArrowForward />
              </button>
            </NavLink>
          </div>
          <figure className="hero_image">
            <img
              src="\src\assets\images\lern.png"
              alt="learning"
              className="lerning"
            />
          </figure>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats_section">
        <div className="container">
          <div className="stats_container">
            <div className="stat_item">
              <h2>10,000+</h2>
              <p>Students Enrolled</p>
            </div>
            <div className="stat_item">
              <h2>200+</h2>
              <p>Expert Instructors</p>
            </div>
            <div className="stat_item">
              <h2>500+</h2>
              <p>Courses Available</p>
            </div>
            <div className="stat_item">
              <h2>98%</h2>
              <p>Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Section */}
      <div className="brand_section">
        <div className="container">
          <h2 className="brand_heading">Trusted by leading companies</h2>
          <div className="slider_track">
            {brandLogos.map((logo, index) => (
              <div className="slide" key={index}>
                <img src={logo} alt={`Brand ${index}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="courses_section">
        <div className="container">
          <div className="section_heading">
            <h2>Featured Courses</h2>
            <NavLink to="/courses">
              View all <IoIosArrowForward />
            </NavLink>
          </div>
          <div className="courses_grid">
            {featuredCourses.map((course) => (
              <div className="course_card" key={course.id}>
                <img
                  src={course.image}
                  alt={course.title}
                  className="course_image"
                />
                <div className="course_content">
                  <h3>{course.title}</h3>
                  <p className="instructor">By {course.instructor}</p>
                  <div className="rating">
                    <div className="stars">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    <span className="count">
                      {course.rating} ({course.students.toLocaleString()})
                    </span>
                  </div>
                  <div className="price">{course.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials_section">
        <div className="container">
          <div className="testimonials_heading">
            <h2>What Our Students Say</h2>
            <p>
              Hear from our community of learners who have transformed their
              careers with our courses
            </p>
          </div>
          <div className="testimonials_grid">
            {testimonials.map((testimonial) => (
              <div className="testimonial_card" key={testimonial.id}>
                <FaQuoteLeft className="quote_icon" />
                <p className="content">{testimonial.content}</p>
                <div className="author">
                  <img src={testimonial.avatar} alt={testimonial.author} />
                  <div className="author_info">
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="learning_video">
        <div className="container">
          <h2>See Learning in Action</h2>
          <video
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback"
            src="\src\assets\videos\Software Engineer Status _ Developer Whatsapp Status _ Engineering Status🔥 _iit Status__iit__shorts(720P_60FPS).mp4"
            autoPlay
            muted
            controls
          ></video>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta_section">
        <div className="container">
          <h2>Ready to Start Learning?</h2>
          <p>
            Join thousands of students who have already transformed their careers
            with our courses
          </p>
          <NavLink to="/signup">
            <button className="exp">Get Started Now</button>
          </NavLink>
        </div>
      </div>
    </Wrapper>
  );
};

export default Home;