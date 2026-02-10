import React from 'react'
import Card from './Card'
import './Keyfeatures.css'

const KeyFeatures = () => {
  return (
    <>
    <div id="keyfeatures-bin">
    <Card title="My Class" cardTitle="Explore your teachers SKOPRO Sever Inside" link="/myclass" />
    <Card title="Study Box" cardTitle="Explore Syllabus and resource books" link="/studybox" />
    <Card title="Snap Quiz" cardTitle="Make examing easier with Skora AI"  link="/snapquiz"/>
    <Card title="Assignments" cardTitle="Finsh works that your teacher uploaded"  link="/assignments"/>
    <Card title="Report Card" cardTitle="Finsh works that your teacher uploaded" link="/reportcard" />
    </div>
    </>
  )
}

export default KeyFeatures