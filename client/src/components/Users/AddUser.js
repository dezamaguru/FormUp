import React from "react";
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";
import axios from 'axios';

function AddUser() {

    // const initialValues = {
    //     lastName: "",
    //     firstName: "",
    //     email: "",
    //     password: "",
    //     type: "",
    // }

    // const validationSchema = Yup.object().shape({
    //     lastName: Yup.string().required("You must input a last name"),
    //     firstName: Yup.string().required("You must input a first name"),
    //     email: Yup.string().email().required("You must input an email"),
    //     password: Yup.string().required("You must input a password"),
    //     type: Yup.string().required("You must input a type"),
    // })

    // const onSubmit = (data) =>{
    //     axios.post("http://localhost:3001/auth", data).then((response) => {
    //             console.log("it works");
    //     })
    // }

    return <div className="addUserPage">
        <h1>THIS IS THE USERS PAGE</h1>
        {/* <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form>
                <label>Last Name:</label>
                <ErrorMessage name="lastName" component="span" />
                <Field id="inputAddUser" name="lastName" placeholder="Exp. Last Name" autoComplete="off" />

                <label>First Name:</label>
                <ErrorMessage name="firstName" component="span" />
                <Field id="inputAddUser" name="firstName" placeholder="Exp. First Name" autoComplete="off" />

                <label>Email:</label>
                <ErrorMessage name="email" component="span" />
                <Field id="inputAddUser" name="email" placeholder="Exp. Email" autoComplete="off" />

                <label>Password:</label>
                <ErrorMessage name="password" component="span" />
                <Field id="inputAddUser" name="password" placeholder="Exp. Password" autoComplete="off" />

                <label>Type:</label>
                <ErrorMessage name="type" component="span" />
                <Field id="inputAddUser" name="type" placeholder="Exp. Type" autoComplete="off" />

                <button type="submit">Add user</button>
            </Form>
        </Formik> */}
    </div>
}

export default AddUser;