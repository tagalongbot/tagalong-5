<user-profile>
  <!-- Use Materialize CSS -->
  <div class="row">
    <div class="col s12 m7">
      <div class="card">
        <div class="card-image">
          <img src="{ opts.person.profile_image_url }">
          <span class="card-title">{ opts.person.first_name } { opts.person.last_name }</span>
        </div>
        <div class="card-content">
          <span>Gender: { opts.person.gender }</span>
        </div>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Interests</th>
        <th>Professions</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td each="{ opts.person.interests }">{interest}</td>
      </tr>
      <tr>
        <td each="{ opts.person.professions }">{profession}</td>
      </tr>
    </tbody>
  </table>

  <div class="carousel">
    <a each="{ opts.person.photos }" class="carousel-item"><img src="{url}"></a>
  </div>

  <a href="https://www.revenuehits.com/lps/pubref/?ref=@RH@FFjyl_PNOibpA7a-qPeTM8rnUCom4TZr" target="_blank"><img src="https://revenuehits.com/publishers/media/img/v6/180x60_v6.jpg" border="0"></a>

  <script>
    let self = this;

    self.on('mount', function(eventName) {
      document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.carousel');
        var instances = M.Carousel.init(elems, options);
      });
    });
  </script>
</user-profile>