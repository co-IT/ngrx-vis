/* eslint-disable no-undef */

Vue.component('action-network-graphs', {
  template: `
  <section class="ngrx-vis">
    <nav class="navigation">
      <div class="top-menu">
        <img 
          src="img/logo-black.svg"
          alt="logo: outlined, black shield with a black fish inside"
          class="ngrx-vis-logo"
        >
      </div>
      <form class="filter">
        <input v-model="filter" type="text" class="filter-input" placeholder="Filter actions">
      </form>
      <ul class="filter-results">
        <li 
          v-for="action in filteredActions"
          :value="action"
          @click="focusSelectedNode(action)"
        >
          <span class="filter-result-title">{{ action.typeScope }}</span>
          <span class="filter-result-subtitle">{{ action.typeDescription }}</span>
        </li>
      </ul>
    </nav>
    <div class="canvas" ref="canvas"></div>
  </section>
          `,
  data() {
    return {
      visJsNetwork: null,
      filter: ''
    }
  },
  computed: {
    firstNode() {
      return this.nodes[0]
    },
    filteredActions() {
      if (!Array.isArray(this.actionsPlain) || !this.filter) {
        return this.actionsPlain
      }

      const lowerCasedFilter = this.filter.toLowerCase()

      return this.actionsPlain.filter(
        action =>
          action.typeScope.toLowerCase().includes(lowerCasedFilter) ||
          action.typeDescription.toLowerCase().includes(lowerCasedFilter)
      )
    }
  },
  props: ['actionsPlain', 'nodes', 'edges', 'options'],
  methods: {
    focusSelectedNode(node) {
      this.visJsNetwork.focus(node.id, {
        scale: 1,
        offset: { x: -100, y: -150 }
      })
    }
  },
  mounted() {
    this.visJsNetwork = new vis.Network(
      this.$refs.canvas,
      { nodes: this.nodes, edges: this.edges },
      this.options
    )

    this.visJsNetwork.once('beforeDrawing', () => {
      this.visJsNetwork.focus(this.firstNode.id, {
        scale: 1,
        offset: { x: -300, y: -150 }
      })
    })

    this.visJsNetwork.on('click', params => {
      const nodeId = params.nodes[0]

      if (!nodeId) {
        return
      }

      const node = this.nodes.find(node => node.id === nodeId)

      if (!node) {
        return
      }

      const actionJumpTarget = this.actionsPlain.find(
        action => action.typeFull === node.label
      )

      if (!actionJumpTarget) {
        return
      }

      this.visJsNetwork.focus(actionJumpTarget.id, {
        scale: 1,
        offset: { x: -300, y: -150 }
      })
    })
  }
})

// eslint-disable-next-line no-unused-vars
const app = new Vue({
  el: '#vue-app',
  data: {
    actionsPlain: JSON.parse('/* __ACTIONS_PLAIN__ */'),
    networkNodes: JSON.parse('/* __NETWORK_NODES__ */'),
    networkEdges: JSON.parse('/* __NETWORK_EDGES__ */'),
    networkOptions: {
      physics: {
        stabilization: {
          enabled: true,
          iterations: 0,
          fit: true
        }
      },
      nodes: {
        shape: 'dot',
        size: 10,
        color: '#006DF0'
      },
      edges: {
        smooth: {
          type: 'cubicBezier',
          roundness: 0.4
        }
      },
      layout: {
        hierarchical: {
          direction: 'LR',
          sortMethod: 'directed'
        }
      },
      groups: {
        action: {
          shape: 'image',
          image: 'img/action.png'
        },
        component: {
          shape: 'image',
          image: 'img/component.png'
        },
        reducer: {
          shape: 'image',
          image: 'img/reducer.png'
        },
        effect: {
          shape: 'image',
          image: 'img/effect.png'
        },
        'effect-action': {
          shape: 'image',
          image: 'img/action.png',
          size: 10
        },
        dispatch: {
          color: '#DEDEDE',
          size: 5
        }
      }
    }
  }
})
