import React from 'react'

import classes from './Table.module.scss'

const Table = props => {

const  metadataPanel = Object.keys(props.data)
    .map(metaKey => {
        if(metaKey!=="SourceFile")
        return <tr key={metaKey}><td>{metaKey}</td><td>{props.data[metaKey]}</td></tr>
    })

    return (
        <div className={classes.Container}>
            {/* <p className={classes.Title}>{props.children}</p> */}
            <table className={classes.Table}>
            <thead>
                <tr>
                    <th className={classes.Title}>Key</th>
                    <th className={classes.Title}>Value</th>
                </tr>
            </thead>
            <tbody>
                {metadataPanel}
            </tbody>
            </table>
            
        </div>
    )
}

export default Table