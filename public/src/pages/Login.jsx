import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import FadeLoader from 'react-spinners/FadeLoader';
import { isLoggedIn } from '../auth/isloggedin';

export default function Login() {
    const navigate = useNavigate();
    const [DisableBtn, setDisableBtn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [color, setColor] = useState('#ff735c');


    const [values, setValues] = useState({
        email: 'admin@example.com',
        password: '123456',
    });

    useEffect(() => {
        // Simulating a loading state for demonstration purposes
        setTimeout(() => {
            setLoading(false);
        }, 500);
        
        if (isLoggedIn()) {
            navigate('/'); // Redirect to homepage if logged in
        }
    }, []);

    const generateError = (err) =>
        toast.error(err, {
            position: 'top-right',
        });

    const generateSuccess = (res) =>
        toast.success(res, {
            position: 'top-right',
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `https://recipe-management-4886.onrender.com/login`,
                {
                    ...values,
                },
                {
                    withCredentials: true,
                }
            );

            if (data) {
                if (data.errors) {
                    const { email, password } = data.errors;
                    if (email) generateError(email);
                    else if (password) generateError(password);
                } else {
                    generateSuccess('Login Successfully');
                    setDisableBtn(true);
                    localStorage.setItem('_token', data._token);
                    localStorage.setItem('user_id', data.user._id);
                    localStorage.setItem('username', data.user.email);
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                }
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div className="container">
            {loading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <FadeLoader
                        color={color}
                        loading={loading}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            ) : (
                <Row>
                    <Col lg={6} className="d-none d-lg-block">
                        <div className="d-flex justify-content-center align-items-center vh-100">
                            <img src="/images/6101398.jpg" alt="" width="100%" height="500px" />
                        </div>
                    </Col>

                    <Col lg={6} sm={12} md={12}>
                        <div className="d-flex justify-content-center align-items-center vh-100">
                            <Card className="shadow p-3 mb-5 mt-3 bg-white rounded-5 w-100">
                                <Card.Header>
                                    <i className="fa fa-user"></i>&nbsp;Login
                                </Card.Header>
                                <Card.Body>
                                    <Form onSubmit={(e) => handleSubmit(e)}>
                                        <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
                                            <Form.Label>Email Address &nbsp;<span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="email" name="email" required placeholder="Enter email"  onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })} />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                            <Form.Label>Password &nbsp;<span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="password" name="password" required placeholder="Password"  onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })} />
                                        </Form.Group>

                                        <Button variant="success" type="submit" disabled={DisableBtn} className="w-100 mt-3">
                                            <i className="fa fa-sign-in"></i>&nbsp;Login
                                        </Button> &nbsp;
                                        <p className="text-center">
                                            <Link to="/forget-password">Forget your password?</Link>
                                        </p>
                                        <p className="text-center">
                                            Create a new Account? &nbsp; <Link to="/register">Register</Link>
                                        </p>
                                    </Form>
                                    <ToastContainer></ToastContainer>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            )}
        </div>
    );
}
