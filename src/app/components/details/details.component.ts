import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/models/models';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  gameRating: number = 0;
  gameId: string = '';
  routeSub: Subscription;
  gameSub: Subscription;
  game: Game;

  constructor(private route: ActivatedRoute, private api: HttpService) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.gameId = params['id'];
      this.getDetails(this.gameId);
      console.log(this.game);
    });
  }

  getDetails(id: string) {
    this.api.getGame(id).subscribe((data: Game) => {
      this.game = data;
      console.log(data);
      setTimeout(() => {
        this.gameRating = this.game.metacritic;
      }, 1000);
    });
  }

  getColor(value: number): string {
    if (value > 75) {
      return '#5ee432';
    } else if (value > 50) {
      return '#fffa50';
    } else if (value > 30) {
      return '#f7aa38';
    } else {
      return '#ef4655';
    }
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }

    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }
  }
}
