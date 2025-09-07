import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PaymentPage.css";

const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("upi"); 

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setCourse(res.data.course);
      } catch (err) {
        console.error("❌ Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      
      await axios.post(
        "http://localhost:5000/api/enrollments/enroll",
        {
          courseId,
          paymentStatus: "paid", 
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Payment successful! You're now enrolled.");
      navigate(`/course-content/${courseId}`);
    } catch (err) {
      console.error("❌ Payment failed:", err);
      alert("Payment failed. Please try again.");
    }
  };

  if (loading) return <p className="loading-text">Loading payment page...</p>;
  if (!course) return <p className="error-text">Course not found.</p>;

  const thumbnailUrl = course.thumbnail?.startsWith("http")
    ? course.thumbnail
    : `http://localhost:5000/${course.thumbnail}`;

  return (
    <div className="payment-container">
      <div className="payment-course-info">
        <img className="course-thumbnail" src={thumbnailUrl} alt={course.title} />
        <div>
          <h2>{course.title}</h2>
          <p><strong>Instructor:</strong> {course.instructor?.firstName} {course.instructor?.lastName}</p>
          <p><strong>Price:</strong> ₹{course.price}</p>
        </div>
      </div>

      <div className="payment-options">
        <h3>Select Payment Method</h3>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          UPI
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Credit/Debit Card
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="netbanking"
            checked={paymentMethod === "netbanking"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Net Banking
        </label>
      </div>

      <button className="pay-btn" onClick={handlePayment}>
        Pay ₹{course.price}
      </button>
    </div>
  );
};

export default PaymentPage;
