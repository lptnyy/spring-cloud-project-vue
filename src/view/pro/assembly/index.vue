<template>
  <Row>
    <Col span="5">
      <Card>
      </Card>
    </Col>
    <Col span="6" offset="1">
      <Card>
      </Card>
    </Col>
    <Col span="11" offset="1">
      <Card>
      </Card>
    </Col>
  </Row>
</template>

<script>
import vuedraggable from 'vuedraggable'
export default {
  name: 'Assembly',
  components: {
    vuedraggable
  },
  data () {
    return {}
  }
}
</script>

<style scoped>
</style>
