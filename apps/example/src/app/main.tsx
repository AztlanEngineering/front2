import React from 'react'
import ReactDOM, { hydrateRoot } from 'react-dom/client'
import Application, { InnerApp } from './Application.jsx'
import './index.css'

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, <InnerApp />);

