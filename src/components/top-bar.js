import React from 'react';

export default class TopBar extends React.Component {
  render() {
    return !this.props.loggedIn ? null :
      <header style={styles.header}>
        <nav style={styles.nav}>
          {this.iconLink('/mushishi78/content-editor/docs', icons.docs)}
          {this.iconLink('https://github.com/mushishi78/content-editor', icons.github)}
          {this.logout()}
        </nav>
        {this.iconLink('/', icons.home)}
        {this.breadcrumbs(this.props.href || '')}
      </header>
  }

  iconLink(href, icon) {
    return (
      <a href={href} style={styles.a}>
        <i style={styles.icon} className={icon} />
      </a>
    );
  }

  logout() {
    return(
      <a onClick={this.props.logout.bind(this, undefined)}
         href='javascript:void(0)'
         style={styles.logout}>
        <i style={styles.icon} className={icons.logout} />
      </a>
    );
  }

  breadcrumbs(href) {
    return href.split('/').map((label, i, array) => {
      return !label ? null :
        <span style={styles.breadcrumb} key={i}>
          <a href={array.slice(0, i + 1).join('/')} style={styles.a}>{label}</a>
          { i < array.length - 1 ? '/' : '' }
        </span>
    })
  }
}

const icons = {
  home: 'octicon octicon-home',
  logout: 'octicon octicon-log-out',
  docs: 'octicon octicon-info',
  github: 'octicon octicon-mark-github'
}

const styles = {
  header: {
    background: '#fff',
    fontSize: '1.5em',
    padding: '0.3em',
    boxShadow: '0 1px 1px 1px rgba(0,0,0,0.5)'
  },

  nav: {
    float: 'right'
  },

  a: {
    color: '#2980b9',
    padding: '0 0.2em'
  },

  breadcrumb: {
    display: 'inline-block'
  },

  icon: {
    fontSize: '1em',
    color: '#34495e',
    padding: '0.05em 0.2em'
  }
}
