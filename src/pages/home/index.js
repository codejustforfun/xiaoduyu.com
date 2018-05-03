import React from 'react';

// redux
import { loadPostsList } from '../../actions/posts';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import PostsList from '../../components/posts/list';
// import Sidebar from '../../components/sidebar';
import Bundle from '../../components/bundle';


let general = {
  variables: {
    sort_by: "sort_by_date",
    deleted: false,
    weaken: false
  }
}

let recommend = {
  variables: {
    sort_by: "comment_count,like_count,sort_by_date",
    deleted: false,
    weaken: false,
    page_size: 10,
    start_create_at: (new Date().getTime() - 1000 * 60 * 60 * 24 * 30)+''
  }
}

export class Home extends React.Component {

  static loadData({ store, match }) {
    return new Promise(resolve => {

      Promise.all([
        new Promise(async resolve => {
          let [ err, result ] = await loadPostsList({
            id: 'home',
            filters: general
          })(store.dispatch, store.getState);
          resolve([ err, result ])
        }),
        new Promise(async resolve => {
          let [ err, result ] = await loadPostsList({
            id: '_home',
            filters: recommend
          })(store.dispatch, store.getState);
          resolve([ err, result ])
        })
      ]).then(value=>{
        resolve({ code:200 });
      });

    })
  }

  constructor(props) {
    super(props);
  }

  render() {

    const { pathname, search } = this.props.location;

    return(<div>
      <Meta title="首页" />
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <PostsList
              id={'home'}
              filters={general}
              scrollLoad={true}
              />
          </div>
          <div className="col-md-3">
          
          <Bundle load={() => import('../../components/sidebar')}>
            {(Sidebar) => {
              return (<Sidebar recommendPostsDom={<PostsList id={'_home'} itemName="posts-item-title" filters={recommend} />} />)
            }}
          </Bundle>
            {/*
            <Sidebar
              recommendPostsDom={(<PostsList
                id={'_home'}
                itemName="posts-item-title"
                filters={recommend}
              />)}
              />
            */}
          </div>
        </div>
      </div>

    </div>)
  }

}

export default Shell(Home);
